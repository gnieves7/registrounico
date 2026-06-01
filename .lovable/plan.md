
# Flujo de autorización de profesionales

## Estado actual

- `profiles.is_approved`, `approval_decision`, `approval_reason`, `approval_decided_at`, `approval_decided_by` ya existen.
- `AdminAuthorizationsSection` aprueba/rechaza haciendo solo `UPDATE` directo a `profiles`. No asigna rol, no notifica, no audita.
- Enum `app_role` solo tiene `admin` y `patient` → falta el rol `professional`.
- `professional_consents` ya guarda firma + PDF cuando el profesional se registra en `/profesional/registro`.
- Existe `app_notifications` (in-app) y función edge `notify-patient-status` que envía email con Resend.

## Cambios

### 1. Base de datos (migración)

- Agregar valor `'professional'` al enum `app_role`.
- Crear tabla `authorization_audit_log` con: `id`, `professional_user_id`, `decided_by`, `decision` ('approved'|'rejected'|'revoked'), `reason`, `consent_id` (FK opcional a `professional_consents`), `created_at`. RLS: solo admin lee/escribe. GRANTs correspondientes.
- Función `approve_professional(_user_id uuid, _reason text)` y `reject_professional(_user_id uuid, _reason text)` SECURITY DEFINER que en una transacción:
  - Verifica `has_role(auth.uid(),'admin')`.
  - Actualiza `profiles` (is_approved, approval_decision, approval_reason, approval_decided_at, approval_decided_by).
  - Si aprueba: `INSERT INTO user_roles (user_id, role) VALUES (_user_id, 'professional') ON CONFLICT DO NOTHING` y elimina rol `patient` previo si existiera.
  - Si rechaza: elimina cualquier rol `professional`.
  - Inserta fila en `authorization_audit_log` con `consent_id` = último consentimiento firmado del profesional.
  - Inserta `app_notifications` para el profesional (título y mensaje según decisión).
- Trigger en `professional_consents` que actualiza `profiles.consent_accepted_at` y `consent_signature_name` (asegurar sincronía).

### 2. Edge function `notify-professional-status`

- Recibe `{ user_id, decision, reason }`, valida admin igual que `notify-patient-status`.
- Lee email + nombre del profesional, envía email con Resend:
  - Aprobado: "Tu cuenta profesional fue aprobada", link a `/dashboard`, recuerda que el consentimiento firmado queda archivado.
  - Rechazado: motivo + contacto del administrador.
- Registra envío en `activity_log` (`event_type: 'professional_status_email'`).

### 3. UI Admin — `AdminAuthorizationsSection`

- Reemplazar el `UPDATE` directo por `supabase.rpc('approve_professional'|'reject_professional', …)`.
- Después de la RPC invocar `supabase.functions.invoke('notify-professional-status', …)` (no bloquear UX si falla email).
- Mostrar en cada tarjeta el estado del consentimiento (firmado/pendiente) con link a descargar el PDF desde `pdf_storage_path` (signed URL).
- Botón "Ver consentimiento firmado" usando `supabase.storage.from('consents').createSignedUrl(...)` o el bucket existente.
- Agregar pestaña/tabla **Historial de autorizaciones** (lee `authorization_audit_log` joined a profiles): columnas Profesional, Decisión (badge), Motivo, Admin, Fecha. Filtros por decisión y búsqueda por nombre/email. Botón "Revocar acceso" para profesionales aprobados → llama `reject_professional` con motivo obligatorio.

### 4. UI Profesional — notificaciones de estado

- `PendingApproval.tsx`: leer última fila de `authorization_audit_log` (vía RPC `get_my_authorization_status` SECURITY DEFINER que devuelve decisión+motivo+fecha del solicitante) y mostrar:
  - Pendiente (texto actual) si no hay registro.
  - Rechazado: card en rojo con motivo y CTA contacto.
  - Aprobado: redirigir a `/dashboard`.
- `NotificationCenter` ya muestra `app_notifications`; verificar que el nuevo `notification_type='professional_status'` se renderice con icono adecuado.

### 5. Consentimiento informado (requisito 4)

- El flujo `/profesional/registro` ya genera y firma el consentimiento (`ProfessionalRegistration.tsx` + `professional_consents`). Asegurar:
  - Bloquear aprobación en el panel si el profesional no firmó (botón Aprobar deshabilitado con tooltip "Consentimiento no firmado"). La RPC `approve_professional` valida también lado servidor y devuelve error si no hay consent.
  - El PDF firmado se sube al bucket `consents` (crear bucket privado si no existe) con `pdf_storage_path` y se referencia en `authorization_audit_log.consent_id`.
  - Si la `consent_version` vigente cambió, el panel marca "Reconsentimiento requerido" y el profesional debe re-firmar antes de poder operar (ya soportado parcialmente en `ProfessionalRegistration`).

## Archivos a crear / editar

- **Migración nueva** (enum + tabla + RPCs + trigger + bucket `consents` si falta).
- **Crear**: `supabase/functions/notify-professional-status/index.ts`.
- **Editar**: `src/components/admin/dashboard/AdminAuthorizationsSection.tsx` (RPC + email + ver consentimiento + historial + revocar).
- **Crear**: `src/components/admin/dashboard/AuthorizationHistoryTable.tsx`.
- **Editar**: `src/pages/PendingApproval.tsx` (mostrar estado con motivo de rechazo).
- **Editar**: `src/hooks/useAuth.tsx` si hace falta para reflejar rol `professional` en `isProfessional` (ya existe; verificar que reconozca el enum nuevo).
- **Editar**: `src/components/layout/NotificationCenter.tsx` (icono para `professional_status`).

## Fuera de alcance

- Rediseño visual del panel.
- Cambios al editor de notas/recursos simbólicos.
- Migrar profesionales ya aprobados manualmente (script único una vez aplicada la migración: `INSERT INTO user_roles SELECT user_id,'professional' FROM profiles WHERE account_type='professional' AND is_approved=true ON CONFLICT DO NOTHING`).
