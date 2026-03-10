import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface PatientAbcdeViewProps {
  userId: string;
}

export function PatientAbcdeView({ userId }: PatientAbcdeViewProps) {
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, [userId]);

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from("anxiety_abcde_records")
        .select("*")
        .eq("user_id", userId)
        .order("record_date", { ascending: false });
      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error("Error fetching ABCDE records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Skeleton className="h-32 w-full" />;

  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>El paciente no tiene registros ABCDE</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{records.length} registros ABCDE</p>
      {records.map((r) => (
        <Card key={r.id}>
          <CardContent className="py-3 px-4 space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {format(new Date(r.record_date), "dd/MM/yyyy", { locale: es })}
              </Badge>
            </div>
            {r.situation && (
              <div><span className="text-xs font-medium text-primary">A — Situación:</span><p className="text-sm text-foreground">{r.situation}</p></div>
            )}
            {r.thought && (
              <div><span className="text-xs font-medium text-primary">B — Pensamiento:</span><p className="text-sm text-foreground">{r.thought}</p></div>
            )}
            {r.emotion_conduct && (
              <div><span className="text-xs font-medium text-primary">C — Emoción/Conducta:</span><p className="text-sm text-foreground">{r.emotion_conduct}</p></div>
            )}
            {r.debate && (
              <div><span className="text-xs font-medium text-primary">D — Debate:</span><p className="text-sm text-foreground">{r.debate}</p></div>
            )}
            {r.result && (
              <div><span className="text-xs font-medium text-primary">E — Resultado:</span><p className="text-sm text-foreground">{r.result}</p></div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
