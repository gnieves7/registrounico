import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, Eye, FileText, UserCheck, Trash2 } from "lucide-react";

const sections = [
  {
    icon: Shield,
    title: "Responsable del tratamiento",
    content:
      "El responsable del tratamiento de los datos personales es el Lic. Esp. Germán Nieves, profesional matriculado en Psicología, con domicilio electrónico en www.psicodiagnostico-forense.com.ar. Los datos son tratados con estricta confidencialidad conforme a la Ley Nacional de Protección de Datos Personales N° 25.326 y la normativa vigente en la República Argentina.",
  },
  {
    icon: FileText,
    title: "Datos que recopilamos",
    content:
      "Recopilamos los datos que usted proporciona voluntariamente al registrarse y utilizar la plataforma: nombre completo, dirección de correo electrónico, foto de perfil (opcional), registros emocionales, registros de sueños, información de psicobiografía, respuestas a tests psicodiagnósticos (MBTI, MMPI-2), notas de sesiones terapéuticas, datos de casos forenses (cuando corresponda) y cualquier otra información que el paciente ingrese en los formularios de la plataforma.",
  },
  {
    icon: Eye,
    title: "Finalidad del tratamiento",
    content:
      "Los datos personales son utilizados exclusivamente para: acompañar el proceso terapéutico del paciente, facilitar la comunicación entre profesional y paciente, generar registros clínicos digitales, elaborar informes psicodiagnósticos y certificados profesionales, y mejorar la experiencia de uso de la plataforma. En ningún caso los datos serán utilizados con fines comerciales ni compartidos con terceros sin consentimiento expreso.",
  },
  {
    icon: Lock,
    title: "Seguridad de los datos",
    content:
      "Implementamos medidas técnicas y organizativas para proteger sus datos: cifrado en tránsito (HTTPS/TLS), políticas de acceso por filas (RLS) que garantizan que cada paciente solo acceda a sus propios datos, autenticación segura mediante proveedores verificados, URLs firmadas temporales para la descarga de documentos, y almacenamiento en servidores con certificaciones de seguridad internacionales. No almacenamos datos de tarjetas de crédito ni información financiera sensible.",
  },
  {
    icon: UserCheck,
    title: "Derechos del titular",
    content:
      "Conforme a la Ley 25.326, usted tiene derecho a: acceder a sus datos personales almacenados, solicitar la rectificación de datos inexactos, solicitar la supresión de sus datos cuando ya no sean necesarios, oponerse al tratamiento de sus datos, y revocar el consentimiento otorgado. Para ejercer estos derechos, comuníquese a través de los canales indicados en la plataforma o mediante el sitio web del profesional.",
  },
  {
    icon: Trash2,
    title: "Conservación y eliminación",
    content:
      "Los datos clínicos se conservan durante el tiempo que dure la relación terapéutica y por el plazo legal establecido para la conservación de historias clínicas (10 años conforme a la Ley 26.529). Finalizado dicho plazo, los datos serán eliminados de forma segura. Usted puede solicitar la eliminación anticipada de datos no clínicos en cualquier momento.",
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Política de Privacidad
        </h1>
        <p className="mt-2 text-muted-foreground">
          Última actualización: 25 de febrero de 2026
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            En <strong>Registro Clínico Personalizado</strong>, la protección de
            sus datos personales y su salud mental son nuestra prioridad. Esta
            política describe cómo recopilamos, usamos, almacenamos y protegemos
            su información personal conforme a la legislación argentina vigente.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {sections.map((section, index) => (
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
      </div>

      <Separator className="my-8" />

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Al utilizar esta plataforma, usted acepta los términos descritos en
            esta política. Para consultas sobre privacidad y protección de datos,
            visite{" "}
            <a
              href="https://www.psicodiagnostico-forense.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              www.psicodiagnostico-forense.com.ar
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
