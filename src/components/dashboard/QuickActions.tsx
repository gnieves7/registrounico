import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { User, MessageCircle, FileText, Smile } from "lucide-react";

const actions = [
  {
    title: "Mi Psicobiografía",
    description: "Completa tu historia personal",
    icon: User,
    href: "/psychobiography",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Registro Emocional",
    description: "Historial de estados",
    icon: Smile,
    href: "/emotional-record",
    color: "bg-accent text-accent-foreground",
  },
  {
    title: "Hablar con Laura",
    description: "Tu acompañante IA",
    icon: MessageCircle,
    href: "/laura",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    title: "Mis Documentos",
    description: "Constancias e informes",
    icon: FileText,
    href: "/documents",
    color: "bg-primary/10 text-primary",
  },
];

export function QuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {actions.map((action) => (
        <Link key={action.href} to={action.href}>
          <Card className="h-full transition-all hover:shadow-md hover:border-primary/30">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${action.color}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground">{action.title}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {action.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
