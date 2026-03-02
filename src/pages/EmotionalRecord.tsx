import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { EmotionalRecordWidget } from "@/components/emotional/EmotionalRecordWidget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmotionalRecordData {
  id: string;
  emoji: string;
  mood_score: number | null;
  reflection: string | null;
  record_date: string;
  created_at: string;
}

const EmotionalRecord = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<EmotionalRecordData[]>([]);
  const [todayRecord, setTodayRecord] = useState<EmotionalRecordData | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecords = async () => {
    if (!user) return;

    try {
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);

      const { data } = await supabase
        .from("emotional_records")
        .select("*")
        .eq("user_id", user.id)
        .gte("record_date", format(monthStart, "yyyy-MM-dd"))
        .lte("record_date", format(monthEnd, "yyyy-MM-dd"))
        .order("record_date", { ascending: false });

      setRecords(data || []);

      // Check for today's record
      const today = format(new Date(), "yyyy-MM-dd");
      const todayData = (data || []).find((r) => r.record_date === today);
      setTodayRecord(todayData || null);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user, currentMonth]);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getRecordForDay = (day: Date) => {
    return records.find((r) => isSameDay(new Date(r.record_date), day));
  };

  const averageMoodScore = records.length > 0
    ? records.reduce((acc, r) => acc + (r.mood_score || 0), 0) / records.length
    : 0;

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-pulse text-primary">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-3 py-4 md:px-4 md:py-8">
      <div className="mb-8">
        <h1 className="font-serif text-xl font-bold text-foreground md:text-3xl">
          Registro Emocional
        </h1>
        <p className="mt-1 text-muted-foreground">
          Lleva un seguimiento de cómo te sientes cada día
        </p>
      </div>

      <div className="space-y-6">
        {/* Today's Record Widget */}
        <EmotionalRecordWidget
          todayRecord={todayRecord}
          onRecordSaved={fetchRecords}
        />

        {/* Calendar View */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base md:text-lg">Calendario Emocional</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Visualiza tu estado emocional a lo largo del mes
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={previousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="min-w-[120px] text-center text-sm font-medium capitalize md:min-w-[140px] md:text-base">
                  {format(currentMonth, "MMMM yyyy", { locale: es })}
                </span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Weekday Headers */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before the first of the month */}
              {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square p-1" />
              ))}

              {/* Days of the month */}
              {daysInMonth.map((day) => {
                const record = getRecordForDay(day);
                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={day.toISOString()}
                    className={`aspect-square rounded-lg p-1 text-center transition-colors ${
                      isToday ? "ring-2 ring-primary" : ""
                    } ${record ? "bg-primary/5" : "bg-muted/30"}`}
                  >
                    <div className="text-xs text-muted-foreground">
                      {format(day, "d")}
                    </div>
                    {record && (
                      <div className="mt-1 text-lg" title={record.reflection || undefined}>
                        {record.emoji}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        {records.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Resumen del Mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{records.length}</p>
                  <p className="text-sm text-muted-foreground">Días registrados</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <p className="text-2xl font-bold text-primary">
                    {averageMoodScore.toFixed(1)}/5
                  </p>
                  <p className="text-sm text-muted-foreground">Promedio del mes</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <p className="text-2xl font-bold text-primary">
                    {records.filter((r) => r.reflection).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Reflexiones escritas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Reflections */}
        {records.filter((r) => r.reflection).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Reflexiones Recientes</CardTitle>
              <CardDescription>Tus pensamientos de los últimos días</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {records
                .filter((r) => r.reflection)
                .slice(0, 5)
                .map((record) => (
                  <div
                    key={record.id}
                    className="flex items-start gap-3 rounded-lg bg-muted/30 p-3"
                  >
                    <span className="text-2xl">{record.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{record.reflection}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {format(new Date(record.record_date), "EEEE d 'de' MMMM", {
                          locale: es,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmotionalRecord;
