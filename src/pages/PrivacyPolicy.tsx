import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, FileText, Lock, Globe, Scale, Users, Clock, Cookie, Baby, UserCheck, RefreshCw, Gavel, BookOpen } from "lucide-react";

const META = {
  responsable: "Lic. Esp. Germán H. Nieves",
  matricula: "Mat. N° 1889 — Colegio de Psicólogos de Santa Fe",
  email: "pdf.consultas@gmail.com",
  whatsapp: "+54 9 342 627-2158",
  web: "www.psicodiagnostico-forense.com.ar",
  version: "1.0",
  vigencia: "18 de abril de 2026",
};

const articles = [
  {
    n: "Preámbulo",
    icon: ShieldCheck,
    title: "Identificación del Responsable",
    body: [
      `La presente Política de Privacidad regula el tratamiento de los datos personales recolectados y procesados a través de la plataforma .PSI. — Plataforma de Sistemas Interactivos, disponible en ${META.web} (en adelante, «la Plataforma» o «.PSI.»).`,
      "La Plataforma está destinada exclusivamente a profesionales de la salud mental matriculados y a sus pacientes, con el propósito de asistir el ejercicio clínico, psicodiagnóstico y forense dentro del marco ético y legal vigente en la República Argentina.",
      `**Responsable del tratamiento:** ${META.responsable} · ${META.matricula} · Santa Fe, Argentina · ${META.email} · ${META.whatsapp}.`,
      "Al registrarse en .PSI. y utilizar sus servicios, el usuario declara haber leído, comprendido y aceptado íntegramente los términos de la presente Política. Si no está de acuerdo con alguno de sus términos, debe abstenerse de utilizar la Plataforma.",
    ],
  },
  {
    n: "Art. 1",
    icon: Scale,
    title: "Marco Normativo Aplicable",
    body: [
      "**Ley N° 25.326** — Ley de Protección de Datos Personales (Argentina). Norma de referencia principal. Los datos de salud mental se clasifican como datos sensibles y reciben el nivel de protección más elevado.",
      "**Decreto N° 1558/2001** — Reglamentación de la Ley 25.326. Establece las obligaciones del responsable y los mecanismos de ejercicio de los derechos ARCO.",
      "**Ley N° 26.529** — Derechos del Paciente en su Relación con los Profesionales e Instituciones de la Salud. Garantiza la confidencialidad de la historia clínica.",
      "**Ley N° 26.682** — Marco regulatorio de la medicina prepaga.",
      "**Ley N° 27.483** — Aprueba el Convenio 108 del Consejo de Europa sobre protección de datos.",
      "**Resolución DNPDP N° 47/2018** — Medidas de seguridad para responsables de bases de datos en salud.",
      "**Código de Ética del Colegio de Psicólogos de Santa Fe** — Secreto profesional como eje rector del diseño de la Plataforma.",
      "★ Obligación de registro ante la DNPDP (art. 21 Ley 25.326): el responsable se compromete a registrar las bases de datos ante la Dirección Nacional de Protección de Datos Personales.",
    ],
  },
  {
    n: "Art. 2",
    icon: FileText,
    title: "Categorías de Datos Recolectados",
    body: [
      "**2.1 Datos de identificación y contacto del profesional:** nombre y apellido, matrícula y colegio de habilitación, correo electrónico, teléfono, fotografía de perfil (opcional), datos de facturación.",
      "**2.2 Datos de pacientes — datos sensibles (art. 2 Ley 25.326):** datos personales básicos (DNI, domicilio, estado civil, ocupación), historia clínica psicológica, registros de sesiones, datos de salud física, historia familiar y social, registros emocionales, datos forenses (CUIJ, expediente, informes periciales), resultados de tests e instrumentos estandarizados.",
      "**2.3 Datos técnicos de uso:** dirección IP y logs de acceso, tipo de dispositivo y navegador, fecha y hora de actividad, identificadores de sesión y tokens de autenticación.",
    ],
  },
  {
    n: "Art. 3",
    icon: BookOpen,
    title: "Finalidades del Tratamiento",
    body: [
      "**Prestación del servicio:** funcionamiento de los módulos clínicos, psicodiagnósticos y forenses.",
      "**Comunicación terapéutica:** notificaciones de turnos, recordatorios, micro-tareas.",
      "**Seguridad y autenticación:** verificación de identidad y prevención de accesos no autorizados.",
      "**Soporte técnico, facturación y mejora de la Plataforma** (mediante datos agregados y anonimizados).",
      "**Cumplimiento legal:** atención de requerimientos de autoridades competentes en los casos legalmente previstos.",
      "✓ Principio de finalidad: los datos no serán cedidos, vendidos ni compartidos con terceros con fines comerciales o publicitarios bajo ninguna circunstancia.",
    ],
  },
  {
    n: "Art. 4",
    icon: UserCheck,
    title: "Base Legal del Tratamiento y Consentimiento",
    body: [
      "Para datos de identificación y datos técnicos: ejecución de la relación contractual e interés legítimo en la seguridad del servicio.",
      "Para datos sensibles de pacientes: **consentimiento expreso e informado del titular** (art. 7 Ley 25.326) y habilitación profesional sujeta al secreto profesional.",
      "★ El profesional usuario es responsable de obtener el consentimiento informado de sus pacientes para el tratamiento digital de sus datos clínicos.",
    ],
  },
  {
    n: "Art. 5",
    icon: Lock,
    title: "Medidas de Seguridad Técnica y Organizacional",
    body: [
      "**Cifrado en tránsito** (TLS 1.3) y **cifrado en reposo** (AES-256). Credenciales hasheadas con bcrypt/Argon2.",
      "**Control de acceso por roles** (paciente / profesional / administrador) con **Row Level Security (RLS)** en la base de datos.",
      "**Autenticación segura** mediante Google OAuth 2.0 con verificación de correo. Las cuentas profesionales requieren aprobación manual del administrador.",
      "**Auditoría y trazabilidad:** registro de accesos y operaciones sobre datos sensibles.",
      "**Aislamiento de datos:** datos de cada profesional y sus pacientes lógicamente aislados, sin posibilidad de acceso cruzado.",
      "**Gestión de incidentes:** notificación a usuarios afectados y a la DNPDP en los plazos legales.",
      "**Proveedor de infraestructura:** Supabase (región South America / São Paulo, Brasil), sujeto a SOC 2 Tipo II.",
    ],
  },
  {
    n: "Art. 6",
    icon: Globe,
    title: "Transferencia Internacional de Datos",
    body: [
      "**Supabase Inc.** — Infraestructura backend. Servidores en São Paulo, Brasil. Cumple SOC 2 Tipo II.",
      "**Google LLC** — Autenticación OAuth 2.0. Adhiere al Marco de Privacidad UE-EE.UU. y cuenta con certificación ISO 27001.",
      "**Servicios de IA** — El asistente Laura utiliza IA de terceros. El contenido de las conversaciones no incluye datos identificatorios del paciente.",
    ],
  },
  {
    n: "Art. 7",
    icon: Users,
    title: "Derechos ARCO del Titular de los Datos",
    body: [
      "**Acceso:** solicitar información sobre los datos que obran en la Plataforma. Plazo: 30 días corridos.",
      "**Rectificación:** corregir datos inexactos o desactualizados. Plazo: 5 días hábiles.",
      "**Cancelación:** solicitar la supresión de datos cuyo tratamiento no se ajuste a la ley. Plazo: 5 días hábiles.",
      "**Oposición:** oponerse al tratamiento por motivos legítimos.",
      "**Portabilidad:** exportar los datos en formato CSV o PDF.",
      "**Revocación:** revocar el consentimiento en cualquier momento.",
      `Las solicitudes deben dirigirse a **${META.email}** indicando nombre, DNI, derecho a ejercer y datos de contacto.`,
      "Ante respuesta insatisfactoria, el titular puede iniciar una acción de **habeas data** o presentar denuncia ante la **DNPDP** (Av. Pte. Gral. Julio A. Roca 710, 2° piso, CABA).",
    ],
  },
  {
    n: "Art. 8",
    icon: Clock,
    title: "Plazo de Conservación de los Datos",
    body: [
      "**Historia clínica y datos de salud:** mínimo 10 años desde la última prestación (art. 18 Ley 26.529).",
      "**Informes periciales:** mínimo 10 años, en concordancia con plazos de prescripción.",
      "**Datos de facturación y contratos:** 10 años desde la extinción de la relación contractual.",
      "**Datos de acceso y logs técnicos:** 12 meses, salvo obligación legal de mayor plazo.",
      "**Datos post-cancelación del servicio:** accesibles durante 90 días; luego eliminados de forma segura e irreversible.",
    ],
  },
  {
    n: "Art. 9",
    icon: Cookie,
    title: "Cookies y Tecnologías de Rastreo",
    body: [
      "La Plataforma utiliza session storage y local storage exclusivamente para el funcionamiento técnico del servicio. **No se utilizan cookies de rastreo publicitario** ni se comparte información con redes de publicidad.",
      "Tecnologías utilizadas: tokens de sesión, preferencias de interfaz (sistema activo y configuraciones de visualización), logs de actividad técnica.",
      "✓ .PSI. no utiliza cookies de terceros, no integra píxeles de seguimiento de redes sociales y no comercializa datos de comportamiento. La plataforma no contiene publicidad.",
    ],
  },
  {
    n: "Art. 10",
    icon: Baby,
    title: "Menores de Edad",
    body: [
      "El consentimiento para el tratamiento de datos de menores debe ser otorgado por sus representantes legales (padres o tutores), conforme al art. 5 de la Ley 25.326 y el Código Civil y Comercial de la Nación.",
      "En el contexto del Sistema Acompañar (datos forenses), el tratamiento de información de niñas, niños y adolescentes víctimas se rige adicionalmente por la **Ley N° 26.061** de Protección Integral de los Derechos de Niñas, Niños y Adolescentes y el principio de **interés superior del niño**.",
      "La información de menores recibe el más alto nivel de protección técnica disponible.",
    ],
  },
  {
    n: "Art. 11",
    icon: UserCheck,
    title: "Responsabilidad del Profesional Usuario",
    body: [
      "El profesional usuario asume, conjuntamente con el responsable de la Plataforma, el carácter de responsable del tratamiento de los datos de sus pacientes (Ley 25.326). Se obliga a:",
      "• Obtener el consentimiento informado de sus pacientes con carácter previo al ingreso de cualquier información.",
      "• Informar a sus pacientes sobre la existencia de .PSI. y los derechos que les asisten.",
      "• Mantener la confidencialidad de sus credenciales de acceso.",
      "• Notificar de inmediato al responsable ante cualquier uso no autorizado o brecha de seguridad.",
      "• No ingresar datos sin consentimiento válido ni utilizar la Plataforma para finalidades distintas a la práctica clínica, psicodiagnóstica o forense.",
      "• Cumplir con el secreto profesional y las obligaciones éticas inherentes a su habilitación.",
    ],
  },
  {
    n: "Art. 12",
    icon: RefreshCw,
    title: "Actualizaciones de la Política",
    body: [
      "El responsable se reserva el derecho de modificar la presente Política para adaptarla a cambios legislativos, jurisprudenciales o nuevas funcionalidades.",
      "Las modificaciones serán notificadas mediante: aviso destacado en la pantalla de inicio, correo electrónico a la dirección registrada, y publicación de la nueva versión con fecha de vigencia.",
      "En caso de cambios sustanciales que afecten derechos de los usuarios, se solicitará nuevo consentimiento expreso.",
    ],
  },
  {
    n: "Art. 13",
    icon: Gavel,
    title: "Jurisdicción y Ley Aplicable",
    body: [
      "La presente Política se rige por las leyes de la **República Argentina**.",
      "Para cualquier controversia, las partes se someten a la jurisdicción de los **Tribunales Ordinarios de la ciudad de Santa Fe**, con renuncia expresa a cualquier otro fuero.",
      "La Política ha sido redactada en idioma español. En caso de traducción, prevalecerá la versión en español.",
    ],
  },
];

function renderBody(text: string) {
  // Convert **bold** markdown to <strong>
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-foreground">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login"><ArrowLeft className="h-4 w-4 mr-2" /> Volver al inicio</Link>
          </Button>
        </div>

        <div className="mb-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-3">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            Política de Privacidad y Protección de Datos
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            .PSI. — Plataforma de Sistemas Interactivos para la Práctica Psicológica
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Versión {META.version} · Vigencia desde {META.vigencia}
          </p>
        </div>

        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <p className="text-sm leading-relaxed">
              <strong className="text-foreground">{META.responsable}</strong> · {META.matricula}
              <br />
              Santa Fe, República Argentina · <a href={`mailto:${META.email}`} className="text-primary hover:underline">{META.email}</a> · {META.whatsapp}
              <br />
              <a href={`https://${META.web}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {META.web}
              </a>
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {articles.map((art, i) => {
            const Icon = art.icon;
            return (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-start gap-3 text-lg">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <span className="block text-xs font-semibold uppercase tracking-wide text-primary">
                        {art.n}
                      </span>
                      <span className="block text-foreground">{art.title}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {art.body.map((p, j) => (
                    <p key={j}>{renderBody(p)}</p>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 rounded-lg border border-border bg-muted/30 p-5 text-center text-xs text-muted-foreground">
          <p>
            <strong className="text-foreground">{META.responsable}</strong> · {META.matricula}
          </p>
          <p className="mt-1">
            Fecha de vigencia: {META.vigencia} · Versión {META.version}
          </p>
          <p className="mt-2">
            Para cualquier consulta sobre el tratamiento de tus datos, escribinos a{" "}
            <a href={`mailto:${META.email}`} className="text-primary hover:underline">{META.email}</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
