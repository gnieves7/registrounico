import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

interface EmotionalRecord {
  id: string;
  emoji: string;
  mood_score: number | null;
  reflection: string | null;
  record_date: string;
  created_at: string;
}

interface PatientEmotionalViewProps {
  userId: string;
}

export function PatientEmotionalView({ userId }: PatientEmotionalViewProps) {
  const [records, setRecords] = useState<EmotionalRecord[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, [userId, currentMonth]);

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);

      const { data, error } = await supabase
        .from("emotional_records")
        .select("*")
        .eq("user_id", userId)
        .gte("record_date", format(monthStart, "yyyy-MM-dd"))
        .lte("record_date", format(monthEnd, "yyyy-MM-dd"))
        .order("record_date", { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Calendar View */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Calendario Emocional</CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={previousMonth} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-[100px] text-center text-sm font-medium capitalize">
                {format(currentMonth, "MMM yyyy", { locale: es })}
              </span>
              <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Weekday Headers */}
          <div className="mb-1 grid grid-cols-7 gap-1">
            {["D", "L", "M", "M", "J", "V", "S"].map((day, i) => (
              <div key={i} className="p-1 text-center text-xs font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells */}
            {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square p-1" />
            ))}

            {/* Days */}
            {daysInMonth.map((day) => {
              const record = getRecordForDay(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  className={`aspect-square rounded-md p-0.5 text-center ${
                    isToday ? "ring-1 ring-primary" : ""
                  } ${record ? "bg-primary/5" : "bg-muted/30"}`}
                >
                  <div className="text-[10px] text-muted-foreground">
                    {format(day, "d")}
                  </div>
                  {record && (
                    <div className="text-sm" title={record.reflection || undefined}>
                      {record.emoji}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {records.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Resumen del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-xl font-bold text-primary">{records.length}</p>
                <p className="text-xs text-muted-foreground">Registros</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-xl font-bold text-primary">
                  {averageMoodScore.toFixed(1)}/5
                </p>
                <p className="text-xs text-muted-foreground">Promedio</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-xl font-bold text-primary">
                  {records.filter((r) => r.reflection).length}
                </p>
                <p className="text-xs text-muted-foreground">Reflexiones</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reflections */}
      {records.filter((r) => r.reflection).length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Reflexiones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {records
              .filter((r) => r.reflection)
              .slice(0, 10)
              .map((record) => (
                <div
                  key={record.id}
                  className="flex items-start gap-2 rounded-lg bg-muted/30 p-2.5"
                >
                  <span className="text-lg">{record.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{record.reflection}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
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

      {records.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No hay registros emocionales para este mes
        </div>
      )}
    </div>
  );
}
