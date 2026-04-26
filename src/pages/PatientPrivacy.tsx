import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  KeyRound,
  HeartHandshake,
  ArrowLeft,
  BookOpenCheck,
} from "lucide-react";

/**
 * Pantalla de privacidad orientada al paciente: lenguaje claro, empático,
 * sin jerga jurídica. Explica cómo se cuida la información sensible y
 * cómo se generan las constancias e informes.
 * Para el detalle legal completo el paciente puede ir a /privacy-policy.
 */
export default function PatientPrivacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="gap-1.5">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link to="/privacy-policy">
            <BookOpenCheck className="h-4 w-4" />
            Versión legal completa
          </Link>
        </Button>
      </div>

      <header className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <ShieldCheck className="h-7 w-7 text-primary" />
        </div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
          Tu privacidad, en palabras claras
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
          Esta es una explicación breve, sin tecnicismos, sobre cómo cuidamos tu
          información y cómo se generan las constancias e informes que podés
          descargar.
        </p>
      </header>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lock className="h-4 w-4 text-primary" />
              ¿Quién puede ver lo que escribís?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Solo vos y tu profesional. Ni otros pacientes, ni terceros, ni el
              equipo técnico tienen acceso a tus registros emocionales, sueños,
              cuaderno o tests.
            </p>
            <p>
              Las notas de tu cuaderno son <strong>privadas por defecto</strong>:
              solo se comparten si vos activás explícitamente el switch
              "Compartir con mi terapeuta".
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="h-4 w-4 text-primary" />
              ¿Cómo se protege la información sensible?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Toda la información viaja cifrada (HTTPS) y se almacena en una
              base de datos con <strong>reglas estrictas de acceso por usuario</strong>:
              cada registro lleva tu identificador y solo se sirve si quien
              consulta sos vos o tu profesional autorizado.
            </p>
            <p>
              Los archivos PDF se guardan en un bucket privado y se descargan
              mediante enlaces firmados de corta duración (10 minutos), que
              caducan automáticamente.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-primary" />
              ¿Cómo se generan tus constancias e informes?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Tu profesional revisa los datos clínicos (sesiones, tests, historia
              clínica) y redacta la constancia o el informe en su panel. El
              sistema arma un PDF con su firma, matrícula y la leyenda de
              confidencialidad obligatoria.
            </p>
            <p>
              Los informes diagnósticos (MMPI-2, MBTI, MCMI-III, SCL-90-R) se
              generan a partir de tus respuestas. <strong>Nunca</strong> se
              autodiagnostican: la interpretación clínica siempre la hace tu
              profesional.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <KeyRound className="h-4 w-4 text-primary" />
              ¿Cómo descargás un PDF?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Cuando tu profesional libera un informe, recibís en tu panel un
              <strong> código de 6 dígitos</strong> con vencimiento (24 hs por
              defecto). Ingresás el código en la sección "Descargar PDF" y se
              genera un enlace temporal único para vos.
            </p>
            <p>
              El código sirve <strong>una sola vez</strong>. Si lo perdés o
              expira, podés pedirle uno nuevo a tu profesional.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <HeartHandshake className="h-4 w-4 text-primary" />
              Tus derechos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="ml-5 list-disc space-y-1">
              <li>Acceder a tu información cuando quieras.</li>
              <li>Pedir correcciones si algo no es exacto.</li>
              <li>Solicitar la baja de tu cuenta y la eliminación de tus datos.</li>
              <li>Saber quién accedió y cuándo (auditoría disponible a pedido).</li>
            </ul>
            <p className="pt-2">
              Cualquier consulta sobre tus datos podés hacerla directamente a tu
              profesional o por los canales de contacto institucionales.
            </p>
          </CardContent>
        </Card>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Este resumen no reemplaza la{" "}
        <Link to="/privacy-policy" className="underline">
          política de privacidad completa
        </Link>
        , que detalla el marco normativo aplicable (Ley 25.326, 26.529, 26.657 y
        normativa provincial de Santa Fe).
      </p>
    </div>
  );
}