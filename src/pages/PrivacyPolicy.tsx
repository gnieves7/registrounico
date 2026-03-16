import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Lock,
  Eye,
  FileText,
  UserCheck,
  Trash2,
  Scale,
  BookOpen,
  Globe,
  Building2,
  GraduationCap,
  AlertTriangle,
  ScrollText,
  BadgeCheck,
  MessageCircle,
} from "lucide-react";

const professionalInfo = {
  name: "Lic. Esp. Germán Nieves",
  title: "Licenciado en Psicología — Especialista en Psicología Forense",
  matricula: "Matrícula 1889 F89. L11",
  university1: "Universidad Católica de Santa Fe",
  university2: "Universidad Nacional de Rosario (Especialización)",
  address: "Obispo Gelabert 2478, Santa Fe, Argentina",
  phone: "+54 9 342 627-2158",
  email: "pdf.consultas@gmail.com",
  website: "www.psicodiagnostico-forense.com.ar",
  affiliations: [
    "Colegio de Psicólogos de Santa Fe",
    "APFRA — Asociación de Psicólogos Forenses de la República Argentina",
    "ALPJF — Asociación Latinoamericana de Psicología Jurídica y Forense",
  ],
};

const privacySections = [
  {
    icon: Shield,
    title: "Responsable del tratamiento",
    content: `El responsable del tratamiento de los datos personales es el ${professionalInfo.name}, profesional matriculado en Psicología (${professionalInfo.matricula}), con domicilio profesional en ${professionalInfo.address} y domicilio electrónico en ${professionalInfo.website}. Los datos son tratados con estricta confidencialidad conforme a la Ley Nacional de Protección de Datos Personales N° 25.326 y la normativa vigente en la República Argentina.`,
  },
  {
    icon: FileText,
    title: "Datos que recopilamos",
    content:
      "Recopilamos los datos que usted proporciona voluntariamente al registrarse y utilizar la plataforma: nombre completo, dirección de correo electrónico, foto de perfil (opcional), registros emocionales y del estado de ánimo, registros de sueños, información de psicobiografía, respuestas a tests psicodiagnósticos (MBTI, MMPI-2), notas de sesiones terapéuticas, datos de casos forenses (cuando corresponda), micro-tareas terapéuticas, formulaciones de caso, valoraciones de alianza terapéutica, línea de vida y eventos significativos, entradas del cuaderno personal, y cualquier otra información que el usuario ingrese en los formularios de la plataforma.",
  },
  {
    icon: Eye,
    title: "Finalidad del tratamiento",
    content:
      "Los datos personales son utilizados exclusivamente para: acompañar el proceso terapéutico del paciente, facilitar la comunicación entre profesional y paciente, generar registros clínicos digitales, elaborar informes psicodiagnósticos y certificados profesionales, realizar seguimiento de resultados clínicos (PHQ-9, GAD-7, ORS, SRS), detectar patrones narrativos y emocionales con fines clínicos, y mejorar la experiencia de uso de la plataforma. En ningún caso los datos serán utilizados con fines comerciales ni compartidos con terceros sin consentimiento expreso del titular.",
  },
  {
    icon: Lock,
    title: "Seguridad de los datos",
    content:
      "Implementamos medidas técnicas y organizativas para proteger sus datos: cifrado en tránsito (HTTPS/TLS), políticas de acceso por filas (RLS) que garantizan que cada paciente solo acceda a sus propios datos, autenticación segura mediante proveedores verificados, URLs firmadas temporales para la descarga de documentos, tokens de acceso únicos para vistas de paciente, y almacenamiento en servidores con certificaciones de seguridad internacionales. No almacenamos datos de tarjetas de crédito ni información financiera sensible.",
  },
  {
    icon: MessageCircle,
    title: "Notificaciones por Telegram",
    content:
      "Si el usuario decide vincular voluntariamente su cuenta de Telegram, la plataforma podrá enviar avisos exclusivamente operativos vinculados al tratamiento, como recordatorios de turnos, micro-tareas, premios simbólicos e informes o certificados disponibles. La vinculación requiere una acción expresa del usuario, puede revocarse en cualquier momento desde la plataforma o solicitándolo al profesional, y no habilita campañas masivas, publicidad ni mensajería de alta frecuencia. La frecuencia de estos mensajes será limitada, proporcional y estrictamente funcional al acompañamiento clínico y administrativo.",
  },
  {
    icon: UserCheck,
    title: "Derechos del titular",
    content: `Conforme a la Ley 25.326, usted tiene derecho a: acceder a sus datos personales almacenados, solicitar la rectificación de datos inexactos, solicitar la supresión de sus datos cuando ya no sean necesarios, oponerse al tratamiento de sus datos, y revocar el consentimiento otorgado. Para ejercer estos derechos, comuníquese a ${professionalInfo.email} o al ${professionalInfo.phone}.`,
  },
  {
    icon: Trash2,
    title: "Conservación y eliminación",
    content:
      "Los datos clínicos se conservan durante el tiempo que dure la relación terapéutica y por el plazo legal establecido para la conservación de historias clínicas (10 años conforme a la Ley 26.529). Finalizado dicho plazo, los datos serán eliminados de forma segura. Usted puede solicitar la eliminación anticipada de datos no clínicos en cualquier momento. Las entradas del cuaderno personal pueden ser eliminadas por el paciente en cualquier momento.",
  },
];

const termsOfUseSections = [
  {
    icon: ScrollText,
    title: "Aceptación de los términos",
    content:
      "Al acceder y utilizar la plataforma Registro Clínico Personalizado, usted acepta quedar vinculado por estos Términos de Uso y Condiciones del Servicio. Si no está de acuerdo con alguno de estos términos, le solicitamos que no utilice la plataforma. El uso continuado constituye aceptación de las modificaciones que pudieren realizarse.",
  },
  {
    icon: Building2,
    title: "Naturaleza del servicio",
    content: `Esta plataforma es una herramienta de registro clínico digital que acompaña la práctica profesional del ${professionalInfo.name}. No constituye un servicio de emergencia ni sustituye la atención presencial. La plataforma facilita el seguimiento terapéutico, la administración de instrumentos psicodiagnósticos validados, el registro emocional, la formulación de casos y el monitoreo de resultados clínicos. Todo el contenido clínico es supervisado por un profesional habilitado.`,
  },
  {
    icon: UserCheck,
    title: "Registro y cuenta de usuario",
    content:
      "Para acceder a la plataforma, el usuario debe registrarse con un correo electrónico válido y verificar su identidad. Cada cuenta requiere aprobación del profesional tratante antes de activarse. El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso y de toda actividad que ocurra bajo su cuenta. El profesional se reserva el derecho de desactivar cuentas que incumplan estos términos.",
  },
  {
    icon: AlertTriangle,
    title: "Uso aceptable",
    content:
      "El usuario se compromete a: proporcionar información veraz y actualizada; utilizar la plataforma exclusivamente para los fines terapéuticos previstos; no compartir sus credenciales de acceso con terceros; no intentar acceder a datos de otros usuarios; no utilizar la plataforma para fines ilícitos; y respetar la propiedad intelectual del contenido de la plataforma. El contenido del cuaderno personal es privado y no será accedido por el profesional a menos que el paciente lo comparta voluntariamente.",
  },
  {
    icon: Scale,
    title: "Limitación de responsabilidad",
    content:
      "La plataforma se proporciona 'tal cual' y 'según disponibilidad'. El profesional no garantiza la disponibilidad ininterrumpida del servicio. En caso de emergencia de salud mental, el usuario debe contactar a los servicios de emergencia locales (107 — SAME, 135 — Atención en Crisis). La plataforma no sustituye la consulta profesional presencial ni debe utilizarse como único recurso terapéutico.",
  },
  {
    icon: FileText,
    title: "Propiedad intelectual",
    content:
      "Todo el contenido de la plataforma, incluyendo pero no limitado a: diseño, código, textos, formularios, escalas adaptadas, algoritmos de análisis narrativo, y material educativo, es propiedad del profesional y/o de sus respectivos titulares de derechos. Los instrumentos psicodiagnósticos (MMPI-2, MBTI, PHQ-9, GAD-7, ORS, SRS) son utilizados conforme a las directrices de la International Test Commission (ITC) y bajo licencia de uso profesional.",
  },
  {
    icon: Lock,
    title: "Modificaciones",
    content:
      "El profesional se reserva el derecho de modificar estos Términos de Uso en cualquier momento. Las modificaciones serán notificadas a través de la plataforma y entrarán en vigencia desde su publicación. El uso continuado de la plataforma después de la publicación de modificaciones constituye aceptación de las mismas.",
  },
];

const legalFrameworkSections = [
  {
    icon: Scale,
    title: "Ley N° 25.326 — Protección de los Datos Personales",
    content:
      "Esta plataforma cumple con la Ley N° 25.326 de Protección de los Datos Personales de la República Argentina, garantizando el derecho al honor, la intimidad y el acceso a la información de los titulares de datos. Se implementan las medidas de seguridad previstas en la normativa para la protección de datos sensibles vinculados a la salud.",
  },
  {
    icon: BookOpen,
    title: "Ley N° 26.657 — Ley Nacional de Salud Mental",
    content:
      "El tratamiento de datos clínicos respeta los principios de la Ley N° 26.657 de Salud Mental, reconociendo a las personas con padecimiento mental como sujetos de derecho, garantizando el consentimiento informado, la confidencialidad de la historia clínica y el derecho a recibir información adecuada sobre su tratamiento.",
  },
  {
    icon: GraduationCap,
    title: "Ley N° 24.521 — Educación Superior y ejercicio profesional",
    content:
      "El ejercicio profesional se enmarca en la Ley N° 24.521 de Educación Superior y las regulaciones provinciales correspondientes. El profesional cuenta con título habilitante expedido por universidad reconocida por el Ministerio de Educación de la Nación y cumple con los requisitos de matriculación exigidos por la normativa vigente.",
  },
  {
    icon: Building2,
    title: "Ley Provincial N° 9.538 — Ejercicio Profesional de la Psicología (Santa Fe)",
    content:
      "El profesional ejerce conforme a la Ley Provincial N° 9.538 de Ejercicio Profesional de la Psicología de la Provincia de Santa Fe, cumpliendo con los requisitos de habilitación, matriculación y actualización profesional exigidos por el Colegio de Psicólogos de la provincia.",
  },
  {
    icon: BadgeCheck,
    title: "Código de Ética — FePRA",
    content:
      "La práctica profesional se rige por el Código de Ética de la Federación de Psicólogos de la República Argentina (FePRA), que establece los principios de respeto por la dignidad humana, competencia profesional, integridad, responsabilidad profesional y social, y compromiso con los derechos humanos.",
  },
  {
    icon: BadgeCheck,
    title: "Código de Ética del Psicodiagnosticador — ADEIP",
    content:
      "La administración de instrumentos psicodiagnósticos en esta plataforma se rige por el Código de Ética del Psicodiagnosticador de la Asociación Argentina de Estudio e Investigación en Psicodiagnóstico (ADEIP), que regula la utilización ética de técnicas de exploración y evaluación psicológica.",
  },
  {
    icon: Globe,
    title: "Directrices de la International Test Commission (ITC)",
    content:
      "La administración de instrumentos psicológicos en esta plataforma cumple con las Directrices Internacionales para el Uso de los Tests de la Comisión Internacional de Pruebas (ITC), incluyendo las pautas para la adaptación de tests, la administración informatizada, la seguridad de los materiales de prueba y la interpretación responsable de resultados.",
  },
  {
    icon: Globe,
    title: "Estándares APA, AERA, NCME",
    content:
      "Los procesos de evaluación psicológica implementados respetan los Estándares para Pruebas Educativas y Psicológicas (Standards for Educational and Psychological Testing) desarrollados conjuntamente por la American Psychological Association (APA), la American Educational Research Association (AERA) y el National Council on Measurement in Education (NCME).",
  },
  {
    icon: BookOpen,
    title: "Principios Éticos APA — Código de Conducta",
    content:
      "El profesional adhiere a los Principios Éticos para Psicólogos y Código de Conducta de la American Psychological Association (APA), en particular los estándares referidos a: competencia, relaciones humanas, privacidad y confidencialidad, publicidad, mantenimiento de registros, evaluación y terapia.",
  },
  {
    icon: BadgeCheck,
    title: "Código de Ética — APFRA",
    content:
      "La práctica profesional forense se rige además por el Código de Ética de la Asociación de Psicólogos Forenses de la República Argentina (APFRA), que establece los principios deontológicos específicos para el ejercicio de la psicología en el ámbito jurídico y forense, incluyendo la objetividad, imparcialidad, competencia técnica, respeto por la dignidad de las personas evaluadas, y el compromiso con la verdad y la justicia en los procesos judiciales.",
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Aviso Legal, Términos y Privacidad
        </h1>
        <p className="mt-2 text-muted-foreground">
          Última actualización: 10 de marzo de 2026
        </p>
      </div>

      {/* Professional Card */}
      <Card className="mb-8 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">
                {professionalInfo.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {professionalInfo.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {professionalInfo.matricula}
              </p>
              <p className="text-sm text-muted-foreground">
                {professionalInfo.university1} | {professionalInfo.university2}
              </p>
              <p className="text-sm text-muted-foreground">
                {professionalInfo.address}
              </p>
              <p className="text-sm text-muted-foreground">
                <a
                  href={`https://${professionalInfo.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {professionalInfo.website}
                </a>
                {" | "}
                <a
                  href={`mailto:${professionalInfo.email}`}
                  className="text-primary hover:underline"
                >
                  {professionalInfo.email}
                </a>
              </p>
              <div className="pt-2">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Afiliaciones profesionales:
                </p>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  {professionalInfo.affiliations.map((a, i) => (
                    <li key={i}>• {a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="privacy" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="privacy" className="text-xs sm:text-sm">
            Privacidad
          </TabsTrigger>
          <TabsTrigger value="terms" className="text-xs sm:text-sm">
            Términos de Uso
          </TabsTrigger>
          <TabsTrigger value="legal" className="text-xs sm:text-sm">
            Marco Legal
          </TabsTrigger>
        </TabsList>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                En <strong>Registro Clínico Personalizado</strong>, la
                protección de sus datos personales y su salud mental son nuestra
                prioridad. Esta política describe cómo recopilamos, usamos,
                almacenamos y protegemos su información personal conforme a la
                legislación argentina vigente.
              </p>
            </CardContent>
          </Card>

          {privacySections.map((section, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <section.icon className="h-5 w-5 text-primary" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Terms Tab */}
        <TabsContent value="terms" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Estos Términos de Uso regulan el acceso y utilización de la
                plataforma <strong>Registro Clínico Personalizado</strong>,
                operada por el {professionalInfo.name}. Le recomendamos leer
                atentamente estas condiciones antes de utilizar el servicio.
              </p>
            </CardContent>
          </Card>

          {termsOfUseSections.map((section, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <section.icon className="h-5 w-5 text-primary" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Legal Framework Tab */}
        <TabsContent value="legal" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                La práctica profesional y la operación de esta plataforma se
                enmarcan en el siguiente cuerpo normativo nacional, provincial e
                internacional, garantizando los más altos estándares éticos y
                legales.
              </p>
            </CardContent>
          </Card>

          {legalFrameworkSections.map((section, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <section.icon className="h-5 w-5 text-primary" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Separator className="my-8" />

      {/* Footer */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Al utilizar esta plataforma, usted acepta los términos y condiciones
            descritos en este documento. Para consultas sobre privacidad,
            protección de datos o cuestiones legales, comuníquese a{" "}
            <a
              href={`mailto:${professionalInfo.email}`}
              className="text-primary hover:underline"
            >
              {professionalInfo.email}
            </a>{" "}
            o visite{" "}
            <a
              href={`https://${professionalInfo.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {professionalInfo.website}
            </a>
            .
          </p>
          <p className="text-xs text-muted-foreground mt-4 italic text-center">
            Esta plataforma acompaña la práctica profesional, no la sustituye.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
