import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { TrendingUp } from "lucide-react";

interface DataPoint {
  date: string;
  label: string;
  score: number;
  emoji: string;
}

export function EmotionalEvolutionChart() {
  const { user } = useAuth();
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchRecords = async () => {
      const since = subDays(new Date(), 28).toISOString().split("T")[0];
      const { data: records } = await supabase
        .from("emotional_records")
        .select("record_date, mood_score, emoji")
        .eq("user_id", user.id)
        .gte("record_date", since)
        .order("record_date", { ascending: true });

      if (records && records.length > 0) {
        setData(
          records.map((r) => ({
            date: r.record_date,
            label: format(new Date(r.record_date + "T12:00:00"), "d MMM", { locale: es }),
            score: r.mood_score ?? 5,
            emoji: r.emoji,
          }))
        );
      }
      setLoading(false);
    };

    fetchRecords();
  }, [user]);

  if (loading) return null;
  if (data.length < 2) return null;

  const avg = Math.round((data.reduce((s, d) => s + d.score, 0) / data.length) * 10) / 10;

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4 text-primary" />
          Evolución emocional
          <span className="ml-auto text-xs font-normal text-muted-foreground">
            Promedio: {avg}/10
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="emotionalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10 }}
              className="text-muted-foreground"
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fontSize: 10 }}
              className="text-muted-foreground"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const d = payload[0].payload as DataPoint;
                return (
                  <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
                    <p className="text-sm font-medium text-foreground">
                      {d.emoji} {d.score}/10
                    </p>
                    <p className="text-xs text-muted-foreground">{d.label}</p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#emotionalGradient)"
              dot={{ r: 3, fill: "hsl(var(--primary))" }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="mt-2 text-center text-[10px] text-muted-foreground italic">
          Últimas 4 semanas · Basado en la escala EMA (1-10)
        </p>
      </CardContent>
    </Card>
  );
}
