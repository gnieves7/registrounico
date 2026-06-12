
# Rediseño total estilo macOS · Borravino Pro

Convertir la app en una experiencia tipo macOS Sonoma manteniendo la identidad PSI (logo, paleta borravino, dorado, azul marino, crema). Toda la lógica de negocio, RLS, escuelas y módulos clínicos se conserva intacta: solo cambia el **shell** y el **chrome** de cada módulo.

## 1. Sistema visual base

Nueva capa de design tokens en `src/index.css` y `tailwind.config.ts`:

- **Paleta Borravino Pro**: `--borravino: #3B0A1F`, `--cream: #F5EFE6`, `--gold: #A07C2E`, `--navy: #1C3F6E`.
- **Vidrio (glassmorphism)**: `--glass-bg`, `--glass-border`, `--glass-blur: 24px` con `backdrop-filter` para menu bar, Dock y ventanas.
- **Sombras macOS**: `--shadow-window` (multicapa difusa), `--shadow-dock`, `--shadow-traffic`.
- **Radios**: `--radius-window: 12px`, `--radius-dock: 22px`, `--radius-icon: 14px` (squircle aproximado).
- **Tipografía**: se mantiene Libre Caslon para títulos y se suma `SF Pro`-like vía `-apple-system, BlinkMacSystemFont, 'Inter'` para textos UI; mono `SF Mono` fallback.
- Wallpaper dinámico por escuela activa (gradiente borravino → tono de eje Reflexionar/Evaluar/Acompañar).

## 2. Lock screen (login)

Rediseñar `src/pages/Login.tsx` y `ProfessionalLanding` (acceso) como pantalla de bloqueo:

- Fondo wallpaper con blur, hora y fecha grandes arriba (Libre Caslon).
- Avatar circular del usuario (o logo PSI si anónimo) centrado.
- Campo único de acceso ("Acceder con Google") estilizado como pill macOS.
- Indicador "Mi Práctica · PSI" abajo, badge "Pendiente de aprobación" si corresponde.
- Animación de "desbloqueo" (fade + scale) al autenticar antes de entrar al escritorio.

## 3. Shell macOS (nuevo `MacAppLayout`)

Reemplaza `src/components/layout/AppLayout.tsx` para usuarios autenticados:

```text
┌─ MenuBar (top, glass, 28px) ────────────────────────────┐
│  PSI    Archivo  Editar  Ver  Ventana  Ayuda    🔔 ⚙ 👤│
├─────────────────────────────────────────────────────────┤
│                                                          │
│          ESCRITORIO (wallpaper + widgets)                │
│                                                          │
│        ┌──────────┐  ┌──────────┐                        │
│        │ Próximo  │  │ Notas    │     ← widgets          │
│        │ turno    │  │ recientes│                        │
│        └──────────┘  └──────────┘                        │
│                                                          │
│   ┌────────── Ventana activa (módulo) ──────────┐        │
│   │ ● ● ●   Notas Clínicas                       │        │
│   │ ────────────────────────────────────────────│        │
│   │ contenido del módulo (Outlet)               │        │
│   └─────────────────────────────────────────────┘        │
│                                                          │
│            ╭────────── DOCK ──────────╮                  │
│            │ 🏠 📝 📅 💬 📄 👥  ⚙   │                  │
│            ╰──────────────────────────╯                  │
└─────────────────────────────────────────────────────────┘
```

### 3.1 MenuBar (`src/components/macos/MenuBar.tsx`)
- Logo PSI a la izquierda (icono borravino+dorado existente, sin tocar colores).
- Menús desplegables: **Archivo** (Nuevo paciente, Nueva nota, Exportar), **Editar**, **Ver** (cambiar escuela, tema claro/oscuro), **Ventana** (módulos abiertos), **Ayuda** (docs, soporte).
- Lado derecho: reloj, `NotificationCenter` (icono campana glass), avatar del profesional con menú (Perfil, Cerrar sesión).
- Reemplaza el `<header>` actual del AppLayout.

### 3.2 Desktop (`src/components/macos/Desktop.tsx`)
- Wallpaper con gradiente Borravino + textura suave.
- Widgets clickables (cards glass) en la ruta `/dashboard`: Próximo turno, Últimas notas, Alertas clínicas (ánimo ≤3), Atajos a Laura, Escuela activa.
- Doble clic en widget → abre módulo correspondiente.

### 3.3 Dock (`src/components/macos/Dock.tsx`)
- Barra inferior glass, centrada, con squircles (íconos cuadrados redondeados).
- **Default items**: Inicio, Notas Clínicas, Agenda, Laura, Informes, Pacientes (Finder), separador, Ajustes.
- **Configurable**: tabla nueva `user_dock_preferences (user_id, items jsonb, position text)` con RLS por `auth.uid()`. UI de configuración accesible con clic derecho en el Dock → "Personalizar Dock…".
- Efecto magnify (escala al hover, opcional con toggle accesibilidad).
- Indicador (punto) bajo apps con ventana abierta.
- Badges (rojos) reutilizando `pendingAuthCount` / notificaciones.

### 3.4 Window chrome (`src/components/macos/Window.tsx`)
Wrapper que envuelve cada módulo cargado por `<Outlet/>`:
- Title bar con **traffic lights** (rojo cerrar → vuelve al escritorio, amarillo minimizar → al Dock, verde maximizar → fullscreen).
- Título del módulo (route label) centrado, ícono a la izquierda.
- Borde redondeado, sombra `--shadow-window`, fondo `--cream` con leve translucidez.
- Body con scroll interno; el módulo existente se renderiza sin cambios.

## 4. Finder de pacientes (`src/pages/Finder.tsx`)

Nueva vista accesible desde el Dock que reemplaza/complementa el listado actual de pacientes:

- Sidebar izquierda (Favoritos: Pacientes, Sesiones de hoy, Documentos, Tests; Etiquetas: por escuela, por estado).
- Toolbar superior con vistas (iconos · lista · columnas), búsqueda glass, ordenamiento.
- Panel principal: lista/grilla de pacientes con avatar, nombre, última sesión, escuela.
- Panel derecho de previsualización (Quick Look): al seleccionar paciente muestra resumen + accesos a Notas/Psicobiografía/Documentos.
- Doble clic en paciente → abre `PatientWorkspace` en una nueva ventana macOS.
- Filtros respetan RLS existente (solo pacientes del profesional / admin ve todos).

## 5. Sidebar actual

Se **elimina** la `AppSidebar` para profesionales (su rol pasa al Dock + Finder). Se conserva el componente para vistas legacy de paciente si aplica. La navegación dinámica por `user_area` se traslada al MenuBar (menú **Ver → Sistema**) y al wallpaper coloreado.

## 6. Modo oscuro y temas

- Toggle en MenuBar (☀/🌙) que alterna `data-theme="light|dark"` en `<body>`.
- Borravino Pro tiene variante oscura: fondo `#1A0710`, glass más opaco, dorado más cálido.
- Persistencia en `localStorage` + columna opcional `profiles.theme_pref`.

## 7. Animaciones (Framer Motion)

- Apertura de ventana: scale 0.92→1 + fade desde el ícono del Dock que la disparó (genie-like simplificado).
- Cierre: inverso.
- Dock hover magnify con `useMotionValue` y distancia al cursor.
- Lock screen unlock: blur 20→0, fade.

## 8. Backend (mínimo)

Migración nueva `supabase/migrations/<ts>_user_dock_preferences.sql`:

```sql
CREATE TABLE public.user_dock_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  theme text DEFAULT 'light',
  updated_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_dock_preferences TO authenticated;
GRANT ALL ON public.user_dock_preferences TO service_role;
ALTER TABLE public.user_dock_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own dock" ON public.user_dock_preferences
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

Sin cambios en tablas clínicas.

## 9. Detalles técnicos / archivos

**Nuevos:**
- `src/components/macos/{MenuBar,Desktop,Dock,Window,TrafficLights,DockIcon,Widget,WallpaperProvider}.tsx`
- `src/components/macos/DockCustomizeDialog.tsx`
- `src/hooks/useDockPreferences.ts`, `useWindowManager.ts` (estado de ventanas abiertas/minimizadas, contexto global).
- `src/pages/Finder.tsx`
- `src/lib/macTokens.ts` (constantes shared)
- `supabase/migrations/<ts>_user_dock_preferences.sql`

**Modificados:**
- `src/components/layout/AppLayout.tsx` → delega al nuevo `MacAppLayout`.
- `src/index.css` → tokens Borravino Pro + clases glass + animaciones.
- `tailwind.config.ts` → colores nuevos, keyframes `genie-in/out`, `dock-bounce`.
- `src/pages/Login.tsx` → lock screen.
- `src/App.tsx` → ruta `/finder`, reordenar para que `/dashboard` renderice `Desktop`.
- `src/components/layout/NotificationCenter.tsx` → estilo glass macOS (sin cambiar lógica).

**Eliminados de la composición principal** (no se borran del repo por ahora, quedan disponibles): `AppSidebar` deja de montarse en el shell pro.

## 10. Fuera de alcance

- No se cambia lógica clínica, validaciones de notas, generación de PDFs, tests psicométricos ni Laura.
- No se rediseña la landing pública (`ProfessionalLanding`) más allá del botón de acceso → lock screen.
- No se implementa multi-ventana real concurrente (cada módulo abre como ventana única; "minimizar" guarda estado y muestra ícono activo en Dock, pero el contenido visible es uno a la vez para no romper rutas).

## 11. Entrega por fases

1. Tokens + lock screen + MenuBar + Dock estáticos.
2. Desktop con widgets + Window wrapper aplicado a todas las rutas.
3. Finder de pacientes con Quick Look.
4. Personalización del Dock + persistencia + modo oscuro.
5. Pulido de animaciones y QA responsive (en mobile el Dock se vuelve barra inferior tipo iOS y el MenuBar colapsa a un botón).
