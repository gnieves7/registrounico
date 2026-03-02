import { Scale } from "lucide-react";
import { ForensicSection } from "@/components/psychodiagnostic/ForensicSection";

const Forensic = () => {
  return (
    <div className="mx-auto max-w-4xl px-3 py-4 md:px-4 md:py-6 space-y-4 md:space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2 md:gap-3">
          <Scale className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          <h1 className="text-xl font-bold md:text-3xl">Expediente Forense</h1>
        </div>
        <p className="text-sm text-muted-foreground md:text-base">
          Registro y seguimiento de casos forenses
        </p>
      </div>

      <ForensicSection />
    </div>
  );
};

export default Forensic;
