import { Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CamaraGesell = () => {
  return (
    <div className="mx-auto max-w-4xl px-3 py-4 md:px-4 md:py-6 space-y-4 md:space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2 md:gap-3">
          <Eye className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          <h1 className="text-xl font-bold md:text-3xl">Cámara Gesell</h1>
        </div>
        <p className="text-sm text-muted-foreground md:text-base">
          Protocolos y directrices para la protección de víctimas en el ámbito judicial
        </p>
      </div>

      <Card>
        <CardContent className="prose prose-sm max-w-none p-6 text-foreground space-y-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Existen múltiples protocolos y directrices internacionales y nacionales diseñados para obtener el relato de niños, niñas y adolescentes (NNA) víctimas de violencia sexual, coincidiendo en que la Cámara Gesell es una de las modalidades más eficaces para brindar protección y evitar la revictimización.
          </p>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">1. Protocolos y Directrices</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              El abordaje de estos casos se rige por marcos estructurados que buscan maximizar la calidad de la información y minimizar el impacto emocional en la víctima.
            </p>

            <div className="space-y-3 pl-2 border-l-2 border-primary/20">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Protocolo NICHD</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Es el estándar más utilizado a nivel mundial y cuenta con mayor respaldo de evidencia científica. Se basa en una entrevista estructurada por etapas (introducción, rapport, práctica narrativa, relato libre y cierre) para evitar preguntas sugestivas que contaminen el testimonio.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Protocolo GEV (Guía de Entrevista Investigativa)</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Implementado en Chile, toma como referencia el NICHD y otras guías internacionales para reducir la cantidad de entrevistas y mejorar la persecución penal.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Protocolo SATAC-RATAC</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Muy utilizado en Colombia, se enfoca en la valoración de los procesos cognitivos (percepción, atención, memoria) y la identificación anatómica mediante técnicas como el uso de muñecos sexuados en menores de siete años.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Otros protocolos</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Se mencionan el protocolo de Michigan, el instrumento CAPALIST (para NNA con discapacidad intelectual) y la Entrevista Cognitiva.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">2. La Cámara Gesell como medida de protección</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La legislación y los reglamentos en diversos países establecen que el uso de la Cámara Gesell es la modalidad preferente por ser la menos invasiva. Sus beneficios principales son:
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <Card className="border-primary/10">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-semibold">Evita la revictimización secundaria</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Al permitir que el relato sea recogido y grabado por única vez, se evita que el niño deba repetir su historia traumática ante múltiples funcionarios o en el juicio oral.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-primary/10">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-semibold">Ambiente protegido y empático</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    A diferencia de las oficinas judiciales frías, la Cámara Gesell ofrece un espacio que otorga confianza, privacidad y seguridad, reduciendo la ansiedad y la tensión del NNA.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-primary/10">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-semibold">Separación del imputado</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Garantiza que la víctima no tenga contacto visual ni físico con el agresor. El imputado y su defensa observan desde una sala separada por un vidrio unilateral.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-primary/10">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-semibold">Validez probatoria</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    La grabación de la entrevista sirve como medio de prueba en las audiencias, permitiendo que sea analizada cuantas veces sea necesario sin requerir la presencia física del menor.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">3. Implementación y Estándares Legales</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Para que esta modalidad sea efectiva, debe cumplir con ciertos requisitos:
            </p>

            <div className="space-y-3 pl-2 border-l-2 border-primary/20">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Entrevistadores especializados</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  La entrevista debe ser conducida por profesionales (generalmente psicólogos) capacitados en técnicas de escucha especializada y desarrollo evolutivo.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Etapas de la entrevista</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Se prioriza el relato espontáneo y las preguntas abiertas. El entrevistador debe adoptar una actitud de neutralidad empática, evitando juicios de valor o comentarios autorreferenciales que bloqueen al niño.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Uso obligatorio</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  En países como Bolivia, el marco legal nacional obliga a los fiscales a utilizar la Cámara Gesell para la recepción de declaraciones de víctimas pertenecientes a grupos vulnerables.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Evolución técnica</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Aunque el diseño tradicional incluye un vidrio espejado, existe una tendencia creciente hacia el uso de CCTV, que es logísticamente más sencillo y puede estar en edificios diferentes a los tribunales, lo que resulta menos intimidante para el menor.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 mt-4">
            <p className="text-sm font-medium text-foreground leading-relaxed">
              <strong>En conclusión</strong>, la Cámara Gesell se establece como una herramienta técnico-científica fundamental que transforma a la víctima de un "objeto de prueba" en un sujeto de derechos, garantizando que el proceso judicial no se convierta en una nueva fuente de sufrimiento.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CamaraGesell;
