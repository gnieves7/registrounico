
## Objetivo

Consolidar el panel profesional en un solo workspace clínico, dejar visibles únicamente los tres accesos clínicos (Notas Clínicas, Reserva de Turnos y Recursos Simbólicos), usar la escuela elegida en el login para sugerir plantillas, y permitir buscar pacientes y exportar PDF/constancias en las herramientas de Notas Clínicas.

---

## Fase 1 · Unificar paneles

- `/dashboard` actualmente renderiza `DashboardHome` (mezcla paciente/pro, 366 líneas con quick actions por sistema). Lo convertimos en **redirector** al workspace clínico:
  - Si el usuario es admin/profesional aprobado → `Navigate` a `/admin/dashboard`.
  - Si es paciente (caso futuro) → mantiene el contenido actual, pero hoy todos los accesos profesionales viven en `/admin/dashboard`.
- Quitar el botón "Inicio" / `ArrowLeft` del header de `AdminDashboardLayout` que devolvía a `/dashboard` (ahora apuntará al propio dashboard del workspace, evitando "invasión de secciones").
- Eliminar de la sección `dashboard` (Home) cualquier referencia a paneles paralelos: el único modelo es el Workspace clínico.

## Fase 2 · Permisos del panel Administración (solo 3 accesos)

- En `src/components/admin/AdminDashboardLayout.tsx`:
  - Reemplazar `sidebarGroups` por **un solo grupo** con tres items: `clinical_notes`, `booking`, `symbolic` (más `dashboard` como "Inicio" opcional discreto en el header del sidebar).
  - Eliminar del sidebar los grupos **"Mi práctica"** (Perfil profesional, Monitoreo) y **"Administración"** (Notificaciones, Pacientes avanzado, Solicitudes, Tests, Informes, Consentimientos, Actividad, Auditoría, Profesionales, Autorizaciones, Allowlist, Sugerencias, Configuración).
  - Limpiar el `type AdminSection` para reflejar solo `dashboard | clinical_notes | booking | symbolic` (mantener los demás como tipo interno solo si los reutiliza `CommandPalette`; si no, removerlos).
- En `src/pages/AdminDashboard.tsx`:
  - Eliminar todos los `activeSection === "users" | "professionals" | ... ` y sus imports (`AdminUsersSection`, `AdminProfessionalsSection`, `AdminTestsSection`, `AdminReportsSection`, `AdminNotificationsSection`, `AdminSettingsSection`, `AdminSuggestionsSection`, `AdminPatientProposalsSection`, `AdminAuthorizationsSection`, `AdminAllowlistSection`, `AdminActivitySection`, `AdminAuditConsentsSection`, `AdminReportsAuditSection`, `ProfessionalProfile`, `OutcomeMonitoring`, `AdminDashboardSixMetrics`).
  - Guard: si llega `?section=` con valor fuera de `{dashboard, clinical_notes, booking, symbolic}`, redirigir a `dashboard`.
- `CommandPalette` (`⌘K`): podar entradas a las tres nuevas secciones para evitar saltos a vistas ocultas.
- Los archivos de sección ocultos quedan en el repo (sin importar). Las rutas externas como `/professional-profile`, `/outcome-monitoring`, `/documents` siguen accesibles vía URL directa pero ya no se exponen desde Administración.

## Fase 3 · Escuela activa → plantillas sugeridas

La escuela ya se elige tras el login y se guarda en `sessionStorage['psi_active_school']` (`useActiveSchool`). Vamos a propagarla:

**Notas Clínicas**
- `SessionNoteEditor` ya consume `getTemplatesForSchool(schoolId)`. Verificamos que al **crear** una nota nueva se preseleccione la primera plantilla de la escuela activa y se marque visualmente "Sugerida por tu escuela: {school.name}".
- Añadir en `AdminClinicalNotesSection` un pequeño chip "Escuela activa · {school.name}" para feedback.

**Recursos Simbólicos**
- En `AdminSymbolicResourcesSection.tsx`, ordenar/etiquetar los 13 items según `useActiveSchool()`:
  - Agregar a cada item un `recommendedFor: SchoolType[]` (p. ej. **TCC** → Red de síntomas, Formulación del caso, Micro-tareas; **Psicoanalítico** → Análisis narrativo, Mi Cuaderno; **Sistémico** → Formulación del caso; **Forense / todas** → Cámara Gesell, Apto Psicológico, Junta Médica).
  - Los items recomendados aparecen primero con badge "Sugerido por tu escuela", el resto queda visible debajo en un grupo "Otros recursos".

No requiere migraciones ni cambios de backend.

## Fase 4 · Búsqueda + Export PDF/Constancia en Notas Clínicas

**Búsqueda y filtro de pacientes**
- En `AdminClinicalNotesSection.tsx` agregar un buscador siempre visible (no detrás de toggle) que lista pacientes desde `profiles` (filtrar por `account_type='patient'`) con:
  - Input de búsqueda por nombre/email (debounced).
  - Filtro por estado: `Todos | Activos | Pendientes` (campo `is_approved`).
  - Click en paciente → navega a `/admin/patient/:id` (ya existe `PatientWorkspace`).
- Reutilizar el query de `AdminUsersSection` (extraer función `listPatients` a `src/lib/adminPatients.ts` para no duplicar).

**Export PDF / constancia por sección**
- **Psicobiografía** (`src/pages/Psychobiography.tsx`): botón "Exportar PDF" → nueva función `exportPsychobiographyPdf(patient, data)` en `src/lib/psychobiographyPdf.ts` (jsPDF, estándar Santa Fe ya existente en `lib/pdf/constants.ts`).
- **Mi Cuaderno** (`src/components/admin/PatientNotebookView.tsx`): botón "Exportar constancia" → `exportNotebookPdf(patient, entries)` en `src/lib/notebookPdf.ts`.
- **Termómetro emocional** (`src/pages/EmotionalThermometer.tsx` y/o `PatientEmotionalView`): botón "Exportar PDF" con tabla de registros del rango visible → `exportEmotionalPdf(patient, records)` en `src/lib/emotionalPdf.ts`.
- Todos usan la misma cabecera/firma profesional (`useProfessionalProfile`) ya implementada en `clinicalHistoryPdf.ts` como referencia.
- Registrar cada exportación en `activity_log` vía `activityLogger.ts` con acción `export_pdf` y el módulo de origen (consistente con auditoría existente).

---

## Detalles técnicos

**Archivos a editar**
- `src/pages/DashboardHome.tsx` → redirector
- `src/components/admin/AdminDashboardLayout.tsx` → sidebar reducido + header sin "Inicio" externo
- `src/pages/AdminDashboard.tsx` → solo 4 secciones (dashboard + 3 cards)
- `src/components/admin/CommandPalette.tsx` → podar entradas
- `src/components/admin/dashboard/AdminClinicalNotesSection.tsx` → buscador + chip escuela
- `src/components/admin/dashboard/AdminSymbolicResourcesSection.tsx` → orden por escuela + badge
- `src/components/admin/notes/SessionNoteEditor.tsx` → preselección plantilla por escuela (si no está)
- `src/pages/Psychobiography.tsx`, `src/components/admin/PatientNotebookView.tsx`, `src/pages/EmotionalThermometer.tsx` → botones de export

**Archivos a crear**
- `src/lib/adminPatients.ts` (listado reutilizable)
- `src/lib/psychobiographyPdf.ts`
- `src/lib/notebookPdf.ts`
- `src/lib/emotionalPdf.ts`

**Fuera de alcance**
- No tocar RLS, edge functions, esquema de DB.
- No eliminar archivos de secciones ocultas (solo dejan de exponerse).
- No modificar el flujo de login ni la selección de escuela.
- No tocar el área del paciente (`/dashboard` para no-pro), branding, footer, auth ni Laura.

**Ahorro de créditos**
- Reutilización máxima (templates, jsPDF engine, listado de pacientes).
- Sin migraciones, sin nuevos endpoints, sin assets generados.
- Cambios concentrados en ~10 archivos.
