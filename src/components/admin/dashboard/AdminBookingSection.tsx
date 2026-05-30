import { CalendarClock, ExternalLink } from "lucide-react";
import { ProAgendaWidget } from "./ProAgendaWidget";

const CALENDAR_LINK = "https://calendar.app.google/4Locar4CbcTB45zv9";

export function AdminBookingSection() {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-sky-500/10 p-2.5">
          <CalendarClock className="h-5 w-5 text-sky-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Reserva de turnos</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Generá un turno para terapia o abrí tu Google Calendar para gestionar la agenda completa.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <a
          href={CALENDAR_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-6 transition-all hover:border-primary/40 hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="rounded-lg bg-background/80 p-2.5 shadow-sm">
              <CalendarClock className="h-5 w-5 text-primary" />
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
          </div>
          <h3 className="text-base font-semibold tracking-tight">Turno para terapia</h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Generá un nuevo turno desde tu calendario de reservas. Se sincroniza con la agenda clínica.
          </p>
        </a>

        <a
          href="https://calendar.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl border border-border bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-6 transition-all hover:border-primary/40 hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="rounded-lg bg-background/80 p-2.5 shadow-sm">
              <ExternalLink className="h-5 w-5 text-sky-600" />
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
          </div>
          <h3 className="text-base font-semibold tracking-tight">Abrir Google Calendar</h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Acceso directo a tu calendario para administrar disponibilidad, eventos y recordatorios.
          </p>
        </a>
      </div>

      <ProAgendaWidget />
    </div>
  );
}