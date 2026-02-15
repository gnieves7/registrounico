import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface Stat {
  id: string;
  stat_key: string;
  stat_value: number;
  stat_label: string;
  sort_order: number;
}

const ProfessionalStatsEditor = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data } = await supabase
      .from("professional_stats")
      .select("*")
      .order("sort_order");
    if (data) setStats(data);
  };

  const handleValueChange = (id: string, value: number) => {
    setStats((prev) =>
      prev.map((s) => (s.id === id ? { ...s, stat_value: value } : s))
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      for (const stat of stats) {
        await supabase
          .from("professional_stats")
          .update({ stat_value: stat.stat_value })
          .eq("id", stat.id);
      }
      toast.success("Estadísticas actualizadas correctamente");
    } catch {
      toast.error("Error al actualizar las estadísticas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        Registro de Actividad Profesional
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <div key={stat.id} className="space-y-1">
            <Label className="text-sm">{stat.stat_label}</Label>
            <Input
              type="number"
              min={0}
              value={stat.stat_value}
              onChange={(e) =>
                handleValueChange(stat.id, parseInt(e.target.value) || 0)
              }
            />
          </div>
        ))}
      </div>
      <Button onClick={handleSave} disabled={loading} size="sm">
        <Save className="mr-2 h-4 w-4" />
        {loading ? "Guardando..." : "Guardar cambios"}
      </Button>
    </div>
  );
};

export default ProfessionalStatsEditor;
