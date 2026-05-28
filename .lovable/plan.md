## Objetivo

Convertir el panel del profesional en una herramienta de trabajo clínico real: menos clics, más contexto a la vista, tipografía y densidad pensadas para usar muchas horas seguidas. Estética **Workspace enfocado** (grises fríos `#fafbfc / #e8ecf1 / #94a3b8` + azul `#3b82f6` como acento clínico).

Importante: este rediseño **solo afecta la experiencia del profesional/admin**. La vista del paciente (Reflexionar/Evaluar/Acompañar) queda intacta.

---

## 1. Sistema visual del workspace profesional

Nuevo set de tokens semánticos en `index.css` activado con `body[data-area="pro"]` (sin pisar la paleta Borravino del lado paciente):

- `--background` blanco frío, `--surface` panel `#f7f9fc`, `--border` `#e8ecf1`.
- `--accent` azul clínico `#3b82f6`; estados: éxito verde frío, alerta ámbar, riesgo rojo apagado.
- Tipografía: **Inter** para todo el cuerpo, **IBM Plex Sans** para títulos (más técnica y legible que Playfair en pantalla de trabajo). Tamaño base 13px, line-height 1.5, jerarquía compacta.
- Densidad: cards con padding reducido, separadores `1px` finos en vez de sombras, radios `6px`.
- Modo oscuro opcional con los mismos tokens (sin recargar la app).

## 2. Sidebar reorganizado por flujo clínico

Reemplazo de la lista plana de ~13 ítems administrativos por **5 grupos plegables** que reflejan el flujo de trabajo, manteniendo todas las rutas existentes:

- **Hoy** — Inicio, Próxima sesión, Agenda, Notificaciones.
- **Pacientes** — Listado, ficha unificada (nuevo), formulación de caso, línea de vida.
- **Evaluar** — Tests (MMPI-2, MCMI-III, MBTI, SCL-90-R), informes PDF, consentimientos.
- **Seguir** — Monitoreo de resultados, alianza terapéutica, red de síntomas, análisis narrativo, micro-tareas, premios.
- **Gestión** — Autorizaciones, emails autorizados, actividad, auditorías, sugerencias, configuración.

Grupo activo expandido por defecto según la ruta. Modo colapsado con iconos + tooltip. Badge de pendientes solo en el grupo que corresponde (no esparcido).

## 3. Dashboard profesional rediseñado (`/admin/dashboard`)

Layout de tres columnas pensado para abrir la app y ver de un vistazo el día:

```text
┌─────────────────────────┬─────────────────────┐
│ Próxima sesión (grande) │ Agenda de hoy       │
│ paciente · hora · link  │ lista cronológica   │
├─────────────────────────┤ próximos 7 días     │
│ Alertas clínicas        │                     │
│ (PHQ-9 alto, faltas,    ├─────────────────────┤
│  ánimo ≤3, rupturas)    │ Pacientes activos   │
├─────────────────────────┤ últimos en sesión   │
│ Métricas compactas      │                     │
│ (6 KPIs en una fila)    │                     │
└─────────────────────────┴─────────────────────┘
```

- **Próxima sesión** ocupa la posición principal, con CTA a Google Calendar y a abrir la ficha del paciente.
- **Alertas clínicas** unifica las señales que ya existen (ánimo ≤3, no-respondedores, rupturas de alianza) en un solo feed priorizado.
- **Agenda de hoy** lista compacta con horarios; siempre visible al entrar.
- KPIs se reducen a una fila horizontal (no 6 cards grandes apiladas).

## 4. Vista unificada de paciente (nuevo)

Hoy la información del paciente está repartida en `PatientPsychobiographyView`, `PatientSessionsView`, `PatientDocumentsView`, `PatientDreamsView`, `PatientEmotionalView`, `PatientNotebookView`, `PatientAbcdeView`, `PatientPsychodiagnosticView`. Cada uno abre como modal aparte.

Nueva ruta `/admin/patient/:id` con:

- Header sticky: avatar, nombre, edad, escuela activa, última sesión, próxima sesión, botón "Nueva nota".
- Tabs: **Resumen · Sesiones · Psicobiografía · Tests · Documentos · Seguimiento · Cuaderno**.
- Resumen muestra: formulación breve, últimos PHQ-9/GAD-7, últimos 3 estados emocionales, micro-tareas activas, alertas. Una pantalla = estado clínico del paciente.
- Los componentes `Patient*View` actuales se reutilizan dentro de las tabs (no se reescribe la lógica).

Acceso desde el listado de pacientes y desde la agenda (click en sesión → ficha).

## 5. Notas de sesión más rápidas

Mejoras al editor de sesiones (no cambia el modelo de datos):

- Panel lateral derecho dentro de la ficha del paciente — escribir sin perder el contexto.
- **Plantillas por escuela** (CBT/Psicoanalítico/Humanista/Sistémico/Conductual) tomadas de `useSchoolContent`: bloques precargados (motivo, intervenciones, indicaciones, próxima sesión).
- **Autoguardado** a `localStorage` cada 5s + flush a la DB al cerrar, indicador "Guardado hace Xs".
- **Atajos**: `Cmd/Ctrl+S` guardar, `Cmd/Ctrl+Enter` cerrar sesión, `Cmd/Ctrl+K` paleta de comandos (saltar a paciente, abrir agenda, nueva nota).
- Toolbar mínima: negrita/itálica/lista/cita y un botón "Insertar plantilla".

## 6. Agenda siempre visible

- Widget de agenda en el dashboard (punto 3).
- Mini-agenda colapsable en el header de la ficha de paciente (próximos turnos de ese paciente).
- Sigue usando `list-calendar-events` y el link de Google Calendar ya conectado, no se cambia la integración.

---

## Detalles técnicos

**Archivos a modificar (frontend, sin lógica de negocio nueva):**

- `src/index.css`, `tailwind.config.ts` — tokens `[data-area="pro"]`, fuentes Inter/IBM Plex Sans.
- `src/components/admin/AdminDashboardLayout.tsx` — sidebar agrupado, header simplificado, aplicación de `data-area="pro"`.
- `src/components/admin/dashboard/AdminDashboardHome.tsx` — nuevo layout 3 columnas.
- `src/components/admin/dashboard/AdminDashboardSixMetrics.tsx` — fila compacta.
- `src/components/admin/dashboard/AdminProfessionalsSection.tsx` y `AdminUsersSection.tsx` — densidad de tabla.
- **Nuevo** `src/pages/PatientWorkspace.tsx` + ruta `/admin/patient/:id` en `src/App.tsx`.
- **Nuevo** `src/components/admin/patient/PatientHeader.tsx`, `PatientSummaryTab.tsx`, `SessionNoteEditor.tsx`, `CommandPalette.tsx`.
- Reutilización (sin cambios internos) de los `Patient*View` actuales como contenido de tabs.

**Lo que NO se toca:**

- Sidebar/dashboard/rutas del paciente (Reflexionar/Evaluar/Acompañar).
- RLS, edge functions, esquemas de DB, generación de PDF.
- Lógica de tests, consentimientos, MMPI-2/MCMI-III, formulación de caso, telegram, Laura.
- Branding institucional del landing profesional (Playfair/azul institucional sigue ahí).

**Riesgo:** bajo. Cambios concentrados en presentación y un nuevo contenedor de paciente que envuelve componentes existentes.

## Orden de implementación

1. Tokens visuales + tipografía + activación `data-area="pro"`.
2. Sidebar agrupado por flujo.
3. Dashboard rediseñado con agenda y alertas.
4. Vista unificada de paciente con tabs (reutilizando vistas actuales).
5. Editor de notas rápido + paleta de comandos.
