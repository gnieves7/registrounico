import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Activity } from "lucide-react";

interface Row {
  id: string;
  created_at: string;
  event_type: string;
  event_detail: any;
  user_id: string;
  user_name?: string;
  user_email?: string;
}

export function ProfessionalActivityMonitor() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .eq("account_type", "professional");
      const ids = (profs || []).map((p: any) => p.user_id);
      if (!ids.length) { setRows([]); setLoading(false); return; }
      const { data: logs } = await supabase
        .from("activity_log")
        .select("*")
        .in("user_id", ids)
        .order("created_at", { ascending: false })
        .limit(80);
      const byId: Record<string, any> = Object.fromEntries((profs || []).map((p: any) => [p.user_id, p]));
      setRows(((logs || []) as any[]).map((l) => ({
        ...l,
        user_name: byId[l.user_id]?.full_name,
        user_email: byId[l.user_id]?.email,
      })));
      setLoading(false);
    })();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-4 w-4 text-primary" /> Monitoreo de actividad profesional
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6"><Loader2 className="h-4 w-4 animate-spin text-primary" /></div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">Sin actividad registrada.</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {rows.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-2 rounded-md border border-border p-2 text-xs">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{r.user_name || r.user_email || r.user_id.slice(0, 8)}</p>
                  <p className="text-muted-foreground truncate">{r.event_detail?.summary || r.event_detail?.user_name || ""}</p>
                </div>
                <Badge variant="outline" className="text-[10px]">{r.event_type}</Badge>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleString("es-AR")}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}