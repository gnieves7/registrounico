import { Scale } from "lucide-react";
import { ForensicSection } from "@/components/psychodiagnostic/ForensicSection";

const Forensic = () => {
  return (
    <div className="container py-6 space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Scale className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Expediente Forense</h1>
        </div>
        <p className="text-muted-foreground">
          Registro y seguimiento de casos forenses
        </p>
      </div>

      <ForensicSection />
    </div>
  );
};

export default Forensic;
