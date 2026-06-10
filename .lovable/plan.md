## Cambios por escuela y limpieza del panel

### A) Psicoanalítico — `src/config/menuBySchool.ts`
Los labels que pediste ya están aplicados en el menú: `Historia del Sujeto`, `Cronología del Conflicto`, `Registro Afectivo`, `Vínculo Transferencial`, `Indicaciones de Trabajo`, `Hitos del Proceso`, `Evolución del Proceso`. **No hace falta renombrar nada en sidebar.**

### B) Humanista — `src/config/menuBySchool.ts`
- `Mi Historia de Vida` ✓ ya está
- `Calidad del Encuentro` ✓ ya está
- `Invitaciones de Exploración` ✓ ya está
- `Celebración del Crecimiento` ✓ ya está
- `Proceso de Crecimiento` ✓ ya está
- `Diario de Experiencias` ✓ ya está (en `unconscious`)
- **Renombrar**: `emotional` → `Registro de la Experiencia` (hoy "Registro Experiencial")

### C) Sistémica — `src/config/menuBySchool.ts`
- `Historia del Sistema`, `Línea del Sistema`, `Clima Relacional`, `Prescripciones y Rituales`, `Cambios del Sistema`, `Cambio Relacional` ✓ ya están
- **Renombrar**: `alliance` → `Vínculo Sistémico` (hoy "Vínculo con el Sistema")

### Incluir en Notas Clínicas (las 3 escuelas)
En `src/components/admin/dashboard/AdminClinicalNotesSection.tsx`, ampliar la grilla `tools` para mostrar también, además de las actuales (Psicobiografía, Mi Cuaderno, Alianza, Línea de vida, Termómetro):

- **Indicaciones de trabajo / Invitaciones de Exploración / Prescripciones y Rituales** → ruta `/micro-tasks`
- **Hitos del Proceso / Celebración del Crecimiento / Cambios del Sistema** → ruta `/symbolic-awards`
- **Evolución del Proceso / Proceso de Crecimiento / Cambio Relacional** → ruta `/outcome-monitoring`

Para que los títulos se adapten dinámicamente a la escuela activa, se leerán los `label` desde `MENU_BY_SCHOOL[schoolId]` por `id` (`tasks`, `rewards`, `monitoring`) usando `useActiveSchool()`, con fallback a los nombres genéricos para escuelas que no estén en la solicitud (CBT / Conductual).

### E) Quitar la barra de navegación duplicada — `src/components/admin/AdminDashboardLayout.tsx`
La cabecera ya muestra breadcrumbs (Workspace › Eje › Sección) y un dropdown "Acciones". Debajo hay además una **segunda barra** (`<nav aria-label="Ejes clínicos">` con los pills Reflexionar / Evaluar / Acompañar y sus secciones) que repite la misma información. 

- **Eliminar** ese bloque completo de pills (líneas ~424-465).
- Los saltos entre secciones quedan disponibles mediante: breadcrumbs clicables, dropdown "Acciones", paleta `⌘K` y atajos `g+letra` (ya implementados).
- Resultado: una sola fila de navegación, sin spans repetidos.

### Fuera de alcance
- No se tocan los `tooltip`, contenidos clínicos por escuela, ni la lógica de permisos.
- No se modifica la escuela CBT / Conductual (no incluidas en el pedido).
- No hay cambios de backend ni de rutas.

### Archivos a editar
1. `src/config/menuBySchool.ts` — 2 renames puntuales.
2. `src/components/admin/dashboard/AdminClinicalNotesSection.tsx` — 3 tools nuevos con labels dinámicos por escuela.
3. `src/components/admin/AdminDashboardLayout.tsx` — eliminar la `<nav>` de pills duplicada.