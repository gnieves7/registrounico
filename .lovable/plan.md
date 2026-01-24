

## Registro Clínico Personalizado
### Plataforma Privada para la Dinámica Terapéutica

---

### 🎯 Visión General

Una webapp exclusiva para tus pacientes que sirve como espacio de reflexión, comunicación terapéutica y registro clínico compartido. La plataforma acompaña tu práctica profesional manteniendo los más altos estándares éticos de confidencialidad.

**Estilo visual:** Profesional cálido con tonos tierra, beige y mostaza. Sensación acogedora pero profesional, ideal para un espacio terapéutico digital.

---

### 👥 Roles de Usuario

**1. Paciente**
- Acceso mediante Login con Google (OAuth 2.0)
- Perfil personal con foto y psicobiografía
- Vista de sus sesiones y calendario
- Registro diario de estado emocional
- Comunicación con Laura (asistente IA)
- Descarga de documentos pagos

**2. Psicólogo (Administrador)**
- Login con Google + verificación de rol admin
- Panel de administración completo
- Gestión de todos los pacientes
- Control total sobre sesiones y documentos
- Subida de informes y configuración de precios
- Vista de todos los registros emocionales

---

### 🏠 Páginas y Funcionalidades

#### Para Pacientes

**Dashboard Personal**
- Saludo personalizado con nombre del paciente
- Próxima cita destacada
- Registro rápido del estado de ánimo del día (emojis)
- Acceso directo a Laura (asistente)
- Notificaciones pendientes

**Mi Psicobiografía**
- Formulario digital completo basado en tu modelo (7 páginas)
- Secciones: Datos personales, Familia, Amigos, Actividades, Historia laboral, Historia médica, Alimentación, Consumos, Valores personales, Historia psicológica, Eventos traumáticos, Historia legal
- Guardado progresivo (el paciente puede completar en varias visitas)
- Solo editable por el paciente, administrado por el profesional
- Descarga en PDF cuando lo desee

**Calendario y Sesiones**
- Integración visual con Google Calendar (muestra citas)
- Enlace directo para agendar: tu link de appointments
- Lista de sesiones pasadas con tema tratado
- Posibilidad de agregar notas o preguntas para próxima sesión
- Algunas sesiones editables por paciente, otras solo visibles

**Registro del Estado Emocional**
- Selector de emoji para estado de ánimo (😊 😐 😢 😤 😰 etc.)
- Campo de texto para reflexión breve
- Calendario visual con histórico de estados
- Patrones y tendencias visibles

**Laura, tu acompañante terapéutica**
- Asistente IA conversacional simple
- Responde preguntas básicas sobre psicología
- Explica conceptos teóricos de forma accesible
- Aclara dudas sobre logística (horarios, cancelaciones)
- **Siempre aclara que no sustituye al psicólogo**

**Documentos**
- Lista de documentos disponibles (subidos por el psicólogo)
- Constancia de terapia e informes clínicos
- Precio visible por cada documento
- Botón de pago integrado con Mercado Pago
- Descarga habilitada tras confirmación de pago

---

#### Para el Psicólogo (Panel Admin)

**Dashboard Administrativo**
- Vista general de pacientes activos
- Próximas citas del día/semana
- Alertas de registros emocionales preocupantes
- Resumen de documentos pendientes de entrega

**Gestión de Pacientes**
- Lista de todos los pacientes
- Perfil completo con psicobiografía
- Historial de sesiones
- Registro emocional completo
- Notas privadas del psicólogo

**Gestión de Sesiones**
- Crear/editar sesiones
- Definir qué sesiones puede editar el paciente
- Agregar tema tratado, notas clínicas
- Vincular con calendario

**Documentos e Informes**
- Subir documentos (constancias, informes)
- Definir precio por documento (variable)
- Asignar documento a paciente específico
- Ver estado de pagos

**Configuración**
- Gestión de links de calendario
- Configuración de precios base
- Personalización de mensajes de Laura

---

### 🔐 Seguridad y Ética

- **Autenticación segura** con Google OAuth 2.0
- **Separación de roles** en tabla dedicada (no en perfil)
- **Row Level Security (RLS)** para proteger datos sensibles
- **Sin criterio clínico en frontend** - la plataforma no diagnostica
- **Sin almacenamiento de tarjetas** - pagos via Mercado Pago
- **Datos confidenciales** protegidos según normativas
- **Aviso ético visible**: "Esta plataforma acompaña la práctica profesional, no la sustituye"

---

### 💳 Sistema de Pagos

- Integración con API de Mercado Pago
- Generación de links de pago para cada documento
- Confirmación automática de pago
- Habilitación automática de descarga
- Sin almacenar datos bancarios

---

### 🤖 Laura - Asistente IA

Asistente conversacional simple que:
- Responde preguntas frecuentes
- Explica conceptos psicológicos básicos
- Orienta sobre logística de consultas
- Siempre indica cuando debe consultar al psicólogo
- **No da consejos clínicos ni diagnósticos**

---

### 📱 Diseño Visual

**Paleta de colores:**
- Principal: Tonos tierra cálidos (#8B7355)
- Secundario: Beige suave (#F5F0E8)
- Acento: Mostaza apagado (#C4A574)
- Texto: Marrón oscuro (#4A3728)

**Características:**
- Interfaz simple y acogedora
- Iconografía clara y profesional
- Espacios amplios, sin saturación
- Tipografía legible y cálida
- Responsive (funciona en móvil y desktop)

**Footer permanente:**
> © 2026 Registro Clínico Personalizado  
> Creado y desarrollado por el Lic. Esp. German Nieves  
> Para más información: www.psicodiagnostico-forense.com.ar

---

### 🛠 Tecnología a Utilizar

- **Frontend:** React con TypeScript y Tailwind CSS
- **Backend:** Lovable Cloud con Supabase
- **Base de datos:** PostgreSQL (via Supabase)
- **Autenticación:** Google OAuth 2.0
- **Pagos:** Mercado Pago API
- **IA:** Lovable AI Gateway (para Laura)
- **Almacenamiento:** Supabase Storage (documentos e imágenes)

---

### 📋 Fases de Desarrollo

**Fase 1: Infraestructura y Autenticación**
- Configuración de Lovable Cloud
- Sistema de login con Google
- Roles (paciente/psicólogo)
- Estructura de base de datos

**Fase 2: Funcionalidades Core del Paciente**
- Dashboard personal
- Psicobiografía digital completa
- Registro emocional diario
- Vista de calendario/sesiones

**Fase 3: Panel de Administración**
- Dashboard administrativo
- Gestión de pacientes y sesiones
- Sistema de notas clínicas

**Fase 4: Documentos y Pagos**
- Sistema de documentos
- Integración Mercado Pago
- Descarga de PDFs

**Fase 5: Laura (Asistente IA)**
- Chat conversacional
- Base de conocimiento
- Límites éticos configurados

**Fase 6: Pulido Final**
- Optimización de diseño
- Pruebas de seguridad
- Ajustes de usabilidad

