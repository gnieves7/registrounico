
# Independizar la app del flujo de autoregistro del paciente

Objetivo: dejar esta app como herramienta clínica autónoma del profesional. El backend (Supabase) se mantiene intacto; solo se eliminan las superficies UI/rutas/triggers que servían al auto-registro y a la "app paciente".

## 1. Limpiar rutas y páginas orientadas al paciente

En `src/App.tsx`:
- Quitar las rutas y los `import`:
  - `/paciente/privacidad` (`PatientPrivacy`)
  - `/descargar` (`DescargarPdf`) — flujo del código de descarga para el paciente
  - `/diagnostico-acceso` (`DiagnosticoAcceso`) — autodiagnóstico de acceso del paciente
- Quitar el redirect `/pending-approval → /login` y eliminar la página `src/pages/PendingApproval.tsx` (ya no aplica: el profesional se autoriza por allowlist; si no está, ve el bloque "Acceso no autorizado" del Login actual).
- Borrar archivos: `src/pages/PatientPrivacy.tsx`, `src/pages/DescargarPdf.tsx`, `src/pages/DiagnosticoAcceso.tsx`, `src/pages/PendingApproval.tsx`.

Conservar `/admin/patient/:id` (`PatientWorkspace`) porque es la vista clínica que el profesional usa para leer la ficha del paciente — sigue siendo herramienta del profesional.

## 2. Quitar el widget flotante de paciente del layout

En `src/components/layout/AppLayout.tsx`:
- Eliminar el `import` y el render de `<SessionProposalFloating />` (es un widget pensado para que el paciente acepte/decline propuestas de turno desde su app).
- Borrar `src/components/patient/SessionProposalFloating.tsx` y `src/components/patient/SessionProposalWidget.tsx` si no se usan en otra superficie del profesional (verificar con `rg`).

## 3. Eliminar el alta por email y los rastros de "patient" en el alta de usuarios

En `src/hooks/useAuth.tsx`:
- Quitar `signUpWithEmail` del contexto, su tipo y la implementación. El único login soportado queda Google (lo que ya hace `Login.tsx`).
- Mantener `signInWithEmail` solo si alguna página lo usa; si no, quitarlo también (validar con `rg`).

En la BD (migración):
- Reescribir `public.handle_new_user()` para que:
  - No inserte el rol `'patient'` en `user_roles`.
  - No cree fila en `psychobiographies` para el nuevo usuario (esa tabla se crea sólo al cargar pacientes desde el workspace clínico).
  - Sí mantenga el insert en `profiles` con `account_type='professional'` e `is_approved` desde `authorized_emails`, y la fila en `professional_subscriptions`.
- No se eliminan tablas ni datos existentes (no se rompen pacientes ya cargados que use el profesional como fichas).

## 4. Sacar referencias a "30 pacientes activos" del marketing interno

En `src/pages/ProfessionalLanding.tsx`:
- Reemplazar el plan que dice "Hasta 30 pacientes activos" por "Pacientes ilimitados" (la app es libre para el profesional una vez autorizado por el admin).
- Revisar copy del hero/FAQ que insinúe "el paciente usa la app": dejar claro que es herramienta del profesional; los pacientes sólo aparecen como fichas/registros que él gestiona.

## 5. Auditoría textual final

Tras los cambios, correr `rg -n "PatientPrivacy|DescargarPdf|DiagnosticoAcceso|PendingApproval|SessionProposalFloating|signUpWithEmail"` para confirmar que no quedan imports/usos huérfanos. Si Telegram o notificaciones tenían rutas tipo `/paciente/...` codificadas (no detecté ninguna), redirigirlas al panel del profesional.

## Fuera de alcance

- No se cambia el branding ni los esquemas teóricos.
- No se tocan Edge Functions de consentimientos/PDF: siguen disponibles porque el profesional puede emitir códigos para enviar archivos a un contacto, pero el endpoint público de "canje" ya no tiene página en esta app (si más adelante hace falta canjear códigos, se hace fuera de esta app).
- No se borran tablas `psychobiographies`, `secure_pdf_codes`, etc., para preservar datos clínicos existentes.
- No se modifican RLS más allá del trigger `handle_new_user`.

## Detalle técnico (resumen)

```text
src/App.tsx                          ── borrar 4 rutas + imports
src/components/layout/AppLayout.tsx  ── quitar SessionProposalFloating
src/hooks/useAuth.tsx                ── quitar signUpWithEmail
src/pages/ProfessionalLanding.tsx    ── ajustar copy de planes
DB migration                         ── nueva versión de handle_new_user
delete:
  src/pages/PatientPrivacy.tsx
  src/pages/DescargarPdf.tsx
  src/pages/DiagnosticoAcceso.tsx
  src/pages/PendingApproval.tsx
  src/components/patient/SessionProposal*.tsx  (si no quedan usos)
```
