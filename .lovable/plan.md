## Objetivo
Unificar y robustecer la navegación del Admin Dashboard: sincronizar pills con la URL, breadcrumbs clicables, permisos por rol en "Acciones", acciones contextuales por sección, y accesibilidad/atajos consistentes.

## Cambios propuestos

### 1. Sincronización URL ↔ sección activa
Archivos: `src/pages/AdminDashboard.tsx`

- Reemplazar el `useState` local de `activeSection` por estado derivado de `useSearchParams()` (`?section=...`).
- Crear handler `handleSectionChange(s)` que llame a `setSearchParams({ section: s })` con `replace: false` para que el historial del navegador (Atrás/Adelante) funcione.
- Mantener fallback a `dashboard` si la sección no está en `ALLOWED`.

Resultado: deep links (`/admin?section=booking`), recargas y botones Atrás/Adelante marcan correctamente el pill activo.

### 2. Breadcrumbs clicables
Archivos: `src/components/admin/AdminDashboardLayout.tsx`

- Convertir el span del eje (ej. "Reflexionar") en un `<button>` que navegue a la primera sección del grupo (o a `dashboard` filtrado por eje).
- "Workspace" ya es botón → confirmar foco visible y `aria-label`.
- Sección actual queda como `<span aria-current="page">` (no clicable, indica posición).
- Añadir `nav aria-label="breadcrumb"` y estructura `<ol>/<li>` para semántica correcta.

### 3. Permisos por rol en "Acciones" y pills
Archivos: `src/components/admin/AdminDashboardLayout.tsx`, nuevo helper `src/lib/adminPermissions.ts`

- Definir matriz `SECTION_ROLES: Record<AdminSection, UserRole[]>` (admin ve todo; professional ve clinical_notes/booking/symbolic/interview_models; patient no entra al layout).
- Usar `useUserRole()` ya existente para filtrar:
  - `NAV_GROUPS` → ocultar items no permitidos (pills vacíos se ocultan completos).
  - `DropdownMenu` "Acciones" → ocultar `DropdownMenuItem` no permitidos.
- Si un usuario llega vía URL a una sección no permitida → redirigir a `dashboard` con toast.

### 4. Acciones contextuales por sección
Archivos: `src/components/admin/AdminDashboardLayout.tsx`, opcional bus de eventos `src/lib/uiEvents.ts`

- El menú "Acciones" se vuelve contextual:
  - En `clinical_notes` → acción primaria "Nueva nota" emite evento `admin:new-note` (la sección lo escucha y abre su editor).
  - En `booking` → "Reservar turno" emite `admin:new-booking`.
  - En `interview_models` → "Nueva entrevista/informe" emite `admin:new-interview`.
  - En `symbolic` → "Nuevo recurso" emite `admin:new-symbolic`.
- Mostrar primero la acción de la sección actual (destacada) y debajo el resto como "Otras acciones rápidas".
- Cada `AdminXxxSection` añade un `useEffect` con `window.addEventListener` para el evento que le corresponde y abre el dialog/form ya existente.

### 5. Accesibilidad y atajos
Archivos: `src/components/admin/AdminDashboardLayout.tsx`

- ⌘K / Ctrl+K: ya existe → asegurar que no se dispara cuando el foco está en un input editable (`e.target` instanceof HTMLInputElement/TextArea/contentEditable).
- Añadir atajos:
  - `g` luego `h` → Inicio
  - `g` luego `n` → Notas clínicas
  - `g` luego `b` → Reserva de turnos
  - `g` luego `e` → Entrevistas
  - `/` → enfoca el buscador (abre paleta)
- Pills y botones: añadir `focus-visible:ring-2 ring-ring`, `role="tablist"` opcional para pills con `aria-selected`.
- Botones con solo icono: confirmar `aria-label`.
- Añadir `Skip to content` link al inicio del layout para usuarios de teclado.
- `nav aria-label="Ejes clínicos"` ya existe → confirmar.

## Notas técnicas
- No se modifica lógica de negocio (autosave, drafts, PDF, RLS).
- No se tocan los archivos de Supabase ni edge functions.
- `useUserRole` ya retorna `isAdmin/isProfessional/isPatient`; reusar sin nueva consulta.
- El bus de eventos es ligero (CustomEvent) — evita prop-drilling sin meter un store nuevo.

## Fuera de alcance
- Rediseño visual del header/pills.
- Cambios en la persistencia de escuela o en el formulario psicodiagnóstico.
- Nuevas secciones del admin.
