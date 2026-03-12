import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface UpcomingSessionProps {
  session?: {
    id: string;
    session_date: string;
    topic: string | null;
    calendar_link: string | null;
  } | null;
}

export function UpcomingSession({ session }: UpcomingSessionProps) {
  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Próxima Sesión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No tienes sesiones programadas por el momento.
          </p>
          <Button variant="outline" className="mt-4 transition-all duration-200 hover:scale-105 active:scale-95" asChild>
            <a 
              href="https://calendar.app.google/9do3Ag82RUUN1uNA8" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Solicitar turno
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const sessionDate = new Date(session.session_date);
  const formattedDate = format(sessionDate, "EEEE d 'de' MMMM", { locale: es });
  const formattedTime = format(sessionDate, "HH:mm", { locale: es });

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Próxima Sesión
        </CardTitle>
        <CardDescription>Tu próxima cita con el terapeuta</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-primary/10">
            <span className="text-lg font-bold text-primary">
              {format(sessionDate, "d")}
            </span>
            <span className="text-xs uppercase text-primary">
              {format(sessionDate, "MMM", { locale: es })}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-medium capitalize text-foreground">{formattedDate}</p>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formattedTime} hs</span>
            </div>
            {session.topic && (
              <p className="mt-1 text-sm text-muted-foreground">
                Tema: {session.topic}
              </p>
            )}
          </div>
        </div>

        {session.calendar_link && (
          <Button variant="outline" className="w-full" asChild>
            <a 
              href={session.calendar_link} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Ver en calendario
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
