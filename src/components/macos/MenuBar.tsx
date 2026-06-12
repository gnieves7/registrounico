import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { NotificationCenter } from "@/components/layout/NotificationCenter";
import { Apple, Moon, Sun, LogOut, User, Settings, FileText, NotebookPen, Calendar, FolderOpen, Brain } from "lucide-react";
import { applySystemTheme, setStoredSystemArea, type SystemArea } from "@/lib/systemBranding";

const formatTime = (d: Date) =>
  d.toLocaleString("es-AR", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

export function MacMenuBar() {
  const navigate = useNavigate();
  const { profile, signOut, isAdmin } = useAuth();
  const [now, setNow] = useState(new Date());
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("psi_theme", next ? "dark" : "light"); } catch {}
  };

  const setArea = (area: SystemArea) => {
    setStoredSystemArea(area);
    applySystemTheme(area, true);
    navigate("/dashboard");
  };

  const initials = (profile?.full_name || "U").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="mac-menubar sticky top-0 z-40 flex h-7 items-center gap-1 px-3 text-[13px]">
      {/* Apple-style logo (PSI) */}
      <DropdownMenu>
        <DropdownMenuTrigger className="mac-menu-item flex h-6 items-center gap-1 font-semibold" style={{ color: "var(--mac-gold)" }}>
          <Apple className="h-3.5 w-3.5" />
          <span className="font-serif tracking-wider">.PSI.</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Acerca de .PSI.</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigate("/professional-profile")}><User className="mr-2 h-4 w-4" />Perfil del profesional</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toggleDark}>
            {isDark ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            {isDark ? "Modo claro" : "Modo oscuro"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut().then(() => navigate("/login"))}>
            <LogOut className="mr-2 h-4 w-4" />Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="mac-menu-item h-6 font-semibold">Archivo</DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={() => navigate("/admin/dashboard?section=clinical_notes")}><NotebookPen className="mr-2 h-4 w-4" />Nueva nota clínica</DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/sessions")}><Calendar className="mr-2 h-4 w-4" />Nuevo turno</DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/documents")}><FileText className="mr-2 h-4 w-4" />Informes</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/finder")}><FolderOpen className="mr-2 h-4 w-4" />Abrir Finder</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="mac-menu-item h-6">Editar</DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          <DropdownMenuItem disabled>Deshacer</DropdownMenuItem>
          <DropdownMenuItem disabled>Rehacer</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="mac-menu-item h-6">Ver</DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Cambiar de sistema</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setArea("reflexionar")}><Brain className="mr-2 h-4 w-4" />Reflexionar</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setArea("evaluar")}><FileText className="mr-2 h-4 w-4" />Evaluar</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setArea("acompanar")}><User className="mr-2 h-4 w-4" />Acompañar</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toggleDark}>
            {isDark ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            Tema {isDark ? "claro" : "oscuro"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="mac-menu-item h-6">Ventana</DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={() => navigate("/dashboard")}>Volver al escritorio</DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.location.reload()}>Recargar ventana</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="mac-menu-item h-6">Ayuda</DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem asChild><Link to="/privacy-policy">Política de privacidad</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><a href="mailto:ghnieves14@gmail.com">Contactar soporte</a></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="ml-auto flex items-center gap-2">
        <NotificationCenter />
        <span className="hidden text-xs opacity-80 md:inline">{formatTime(now)}</span>
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-1 outline-none">
            <Avatar className="h-5 w-5">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-[var(--mac-borravino)] text-[9px] text-[var(--mac-cream)]">{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="truncate">{profile?.full_name || "Usuario"}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate("/professional-profile")}><User className="mr-2 h-4 w-4" />Perfil</DropdownMenuItem>
            {isAdmin && <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}><Settings className="mr-2 h-4 w-4" />Panel admin</DropdownMenuItem>}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut().then(() => navigate("/login"))}><LogOut className="mr-2 h-4 w-4" />Cerrar sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}