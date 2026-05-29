## Objetivo

Convertir el panel profesional en una herramienta simple y productiva: una entrada con **tres accesos clínicos** (Notas clínicas, Reserva de turnos, Recursos simbólicos), y dentro de la ficha del paciente un flujo enfocado en **leer, escribir y exportar notas de sesión** con plantillas por escuela, autoguardado y atajos.

## 1. Unificar el panel profesional (Home con 3 accesos)

Reemplazar el dashboard actual (`AdminDashboardHome.tsx`) por una vista limpia con:

- **Cabecera**: saludo + próxima sesión (reutiliza `ProNextSessionCard`) en una sola fila compacta.
- **Tres tarjetas de acceso grandes** (grid 3 columnas, 1 en móvil):
  1. **Notas clínicas** → abre la sección Pacientes (lista para elegir paciente y entrar a su ficha → tab Sesiones/Notas).
  2. **Reserva de turnos** → abre Pacientes con foco en "Nueva sesión" y muestra agenda lateral (reutiliza `ProAgendaWidget`).
  3. **Recursos simbólicos** → nueva sección que agrupa: premios simbólicos del paciente, micro-tareas, alianza terapéutica, recursos profesionales.
- **Sidebar simplificada**: colapsar los 5 grupos a 3 entradas principales (Hoy, Pacientes, Recursos simbólicos) + un grupo "Gestión" plegable con lo administrativo. La paleta de comandos (⌘K) se mantiene.

Archivos: `src/components/admin/dashboard/AdminDashboardHome.tsx` (rediseño), `src/components/admin/AdminDashboardLayout.tsx` (sidebar a 3+1 grupos).

## 2. Ficha del paciente: notas por fecha

En `PatientWorkspace.tsx`, reemplazar el tab "Sesiones" por uno renombrado **"Notas clínicas"** con dos paneles:

- **Izquierda (lista)**: timeline vertical de sesiones del paciente ordenadas por fecha desc., agrupadas por mes. Cada item muestra fecha, hora, tema, badge "Próxima/Pasada" y un indicador si ya tiene notas. Acciones rápidas en cada item: **Editar**, **Exportar PDF** (jsPDF de esa sola nota), **Eliminar**.
- **Derecha (editor)**: al seleccionar una nota, se abre el editor (sección 3). Botón "+ Nueva nota" en cabecera.

Componentes nuevos: `src/components/admin/notes/SessionNotesList.tsx`, `src/components/admin/notes/SessionNoteCard.tsx`, `src/lib/sessionNotePdf.ts` (export individual reutilizando estilo Santa Fe).

Reescribir parcialmente `PatientSessionsView.tsx` para separar lista (sin modal monolítico) y edición.

## 3. Editor de notas con plantillas por escuela

Crear `src/components/admin/notes/SessionNoteEditor.tsx` con:

- **Cabecera**: fecha/hora (date+time picker), tema, switch "editable por paciente".
- **Selector de plantilla** poblado por `useSchoolContent('session_note')` con plantillas específicas por escuela (CBT: ABCDE + SUDs + tarea; Psicoanalítica: après-coup, transferencia; Sistémica: hipótesis, intervención; Humanística: foco vivencial; Conductual: ABC + reforzadores). Al elegir plantilla, se inyectan **campos sugeridos** estructurados como secciones colapsables.
- **Cuerpo**: campos sugeridos por escuela (textareas titulados) + un bloque libre "Notas adicionales". Todo se persiste como markdown en `sessions.clinical_notes` (estructura: `## Sección\ncontenido`).
- **Pie**: estado de guardado ("Guardado hace 3s"), botón Guardar, botón Exportar PDF.

Añadir entradas `session_note` en cada archivo `src/data/{cbt,psychoanalytic,systemic,humanistic,behavioral}Content.ts` con las plantillas.

## 4. Autoguardado y atajos de teclado

Hook nuevo `src/hooks/useAutosave.ts`:
- Debounce 1,5 s tras el último cambio, máximo cada 10 s.
- Estados: `idle | saving | saved | error`, expuestos al editor.
- Backup local en `localStorage` con clave `note-draft:<sessionId>` para recuperación si falla la red.

Atajos (registrados solo cuando el editor tiene foco):
- **Ctrl/Cmd+S** → guardar inmediato.
- **Ctrl/Cmd+Enter** → guardar y cerrar el editor.
- **Ctrl/Cmd+↑ / ↓** → navegar a la nota anterior/siguiente del paciente.
- **Ctrl/Cmd+N** → nueva nota (fecha = ahora).
- **Esc** → cerrar editor (avisa si hay cambios sin guardar).

Indicador visual de atajos en el pie del editor (icono "?" con tooltip).

## Qué NO se toca

- RLS, edge functions, esquema de DB (`sessions` ya tiene todos los campos necesarios).
- Vista del paciente, Reflexionar/Evaluar/Acompañar, tests psicométricos, Laura, Telegram, branding institucional, footer.
- Lógica de aprobación profesional ni autenticación.

## Detalles técnicos

```text
src/
├── components/admin/
│   ├── AdminDashboardLayout.tsx        (sidebar simplificada)
│   ├── dashboard/
│   │   └── AdminDashboardHome.tsx      (rediseño 3 accesos)
│   └── notes/                          (NUEVO)
│       ├── SessionNotesList.tsx
│       ├── SessionNoteCard.tsx
│       └── SessionNoteEditor.tsx
├── hooks/
│   └── useAutosave.ts                  (NUEVO)
├── lib/
│   └── sessionNotePdf.ts               (NUEVO, jsPDF reutiliza constantes Santa Fe)
├── data/
│   ├── cbtContent.ts                   (+ session_note template)
│   ├── psychoanalyticContent.ts        (+ session_note)
│   ├── systemicContent.ts              (+ session_note)
│   ├── humanisticContent.ts            (+ session_note)
│   └── behavioralContent.ts            (+ session_note)
└── pages/
    └── PatientWorkspace.tsx            (tab "Notas clínicas" reemplaza "Sesiones")
```

Persistencia: `sessions.clinical_notes` (texto markdown estructurado). No requiere migración. El nombre de la plantilla usada se guarda como primera línea `<!-- template: cbt -->` para reabrir con la misma estructura.