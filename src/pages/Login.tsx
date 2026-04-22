import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/components/layout/Footer";
import {
  ShieldCheck, LogOut, Heart, BarChart3, Scale, Calendar,
  ArrowLeft, ArrowRight, Building2, MessageCircle, Globe, Mail,
  User, Briefcase, Eye, Lock, Check, Search, BookOpen, Flame,
  Moon, Sun
} from "lucide-react";
import ProfessionalStats from "@/components/landing/ProfessionalStats";
import { toast } from "@/hooks/use-toast";

import logoALPJF from "@/assets/logo_ALPJF.png";
import logoAPFRA from "@/assets/logo_APFRA.png";
import { PsiLogo } from "@/components/ui/PsiLogo";
import {
  applySystemTheme, getStoredSystemArea, setStoredSystemArea,
  type SystemArea
} from "@/lib/systemBranding";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from "@/components/ui/accordion";

const CALENDAR_LINK = "https://calendar.app.google/4Locar4CbcTB45zv9";
const WHATSAPP_LINK = "https://wa.me/5493426272158";
const EMPRESA_EMAIL = "mailto:pdf.consultas@gmail.com";
const EMPRESA_WEB = "https://www.psicodiagnostico-forense.com.ar";

// Paleta unificada Gate
const C = {
  navy: "#1C3F6E",
  navyHover: "#2D5A9E",
  bg: "#F8F7F4",
  card: "#FFFFFF",
  border: "#E2DED8",
  text: "#1A1A1A",
  muted: "#6B6B6B",
  gold: "#A07C2E",
  bgTint: "#EEF3FA",
};

// Colores por sistema (oficiales)
const SYS = {
  reflexionar: { color: "#F97316", tint: "#FFF1E6", label: "Reflexionar", area: "Área Clínica", icon: Heart,
    desc: "Abordaje terapéutico, avances, monitoreo del estado de ánimo e intervenciones clínicas." },
  evaluar:    { color: "#3B82F6", tint: "#E8F0FE", label: "Evaluar",    area: "Área Psicodiagnóstica", icon: BarChart3,
    desc: "Estudio de la personalidad, perfiles, psicodiagnósticos clínicos y aptitud psíquica." },
  acompanar:  { color: "#22C55E", tint: "#E7F8EE", label: "Acompañar",  area: "Área Forense", icon: Scale,
    desc: "Problemática judicial, pericias, análisis del testimonio en Cámara Gesell y prácticas psico-forenses." },
} as const;

type View = "main" | "paciente";

const faqItems = [
  { q: "¿Cómo accedo por primera vez a la plataforma?", a: "Seleccioná \"Soy Paciente\", elegí el sistema que te indicó tu profesional y autenticáte con tu cuenta de Google. Tu acceso será revisado y aprobado antes de ingresar." },
  { q: "¿Mis datos son confidenciales?", a: "Absolutamente. Toda la información es cifrada, almacenada en servidores seguros y solo accesible por vos y tu profesional tratante. Cumplimos con estándares internacionales de protección de datos en salud." },
  { q: "¿Puedo usar la plataforma desde el celular?", a: "Sí, .PSI. está optimizada para dispositivos móviles. Podés acceder desde cualquier navegador sin necesidad de instalar una aplicación." },
  { q: "¿Cómo solicito una consulta o turno?", a: "Podés agendar tu consulta directamente desde la plataforma en la sección \"Mis Turnos\", o contactarnos por WhatsApp o email." },
  { q: "¿Se realizan consultas en modalidad online?", a: "Sí, ofrecemos atención presencial y online por videollamada con la misma calidad y confidencialidad." },
  { q: "¿Cuánto dura una sesión?", a: "Las sesiones clínicas duran entre 45 y 50 minutos. Las evaluaciones psicodiagnósticas pueden requerir entre 60 y 90 minutos." },
  { q: "¿Cuántas sesiones necesito?", a: "Varía según cada caso. En la primera consulta se realiza una evaluación inicial y se establece un plan de trabajo conjunto." },
  { q: "¿Qué diferencia hay entre los tres sistemas?", a: "Reflexionar es el área clínica, Evaluar es el área psicodiagnóstica y Acompañar es el área forense." },
];

const F = "'DM Sans', sans-serif";

const Login = () => {
  const { user, isLoading, isApproved, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<View>("main");
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (user && !isLoading && isApproved) {
      applySystemTheme(getStoredSystemArea());
      const redirectTo = sessionStorage.getItem("login_redirect");
      if (redirectTo) {
        sessionStorage.removeItem("login_redirect");
        navigate(redirectTo, { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
      return;
    }
    applySystemTheme(null);
  }, [user, isLoading, isApproved, navigate]);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const handleGoogleLogin = async (redirectPath: string, area: SystemArea) => {
    try {
      sessionStorage.setItem("login_redirect", redirectPath);
      setStoredSystemArea(area);
      applySystemTheme(area);
      await signInWithGoogle();
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error al iniciar sesión",
        description: "No se pudo conectar con Google. Intentá de nuevo.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: C.bg }}>
        <div className="animate-pulse" style={{ color: C.navy, fontFamily: F }}>Cargando...</div>
      </div>
    );
  }

  if (user && !isApproved) {
    return (
      <div className="flex min-h-screen flex-col" style={{ background: C.bg }}>
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="flex flex-col items-center rounded-lg p-10 max-w-md text-center"
            style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
            <ShieldCheck className="mb-4 h-14 w-14" style={{ color: C.navy }} />
            <h1 className="mb-2 text-2xl font-bold" style={{ color: C.text, fontFamily: F }}>Acceso pendiente de autorización</h1>
            <p className="mb-4" style={{ color: C.muted, fontFamily: F }}>Tu solicitud fue recibida y será revisada por el profesional.</p>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 rounded-md border-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-80"
              style={{ borderColor: C.navy, color: C.navy, fontFamily: F }}
            >
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (user && isApproved) {
    return (
      <div className="flex min-h-screen flex-col" style={{ background: C.bg }}>
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center rounded-lg p-10"
            style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
            <Heart className="mb-4 h-14 w-14" style={{ color: C.navy }} />
            <h1 className="mb-2 text-3xl font-bold" style={{ color: C.text, fontFamily: F }}>¡Hola de nuevo!</h1>
            <p className="mb-8" style={{ color: C.muted, fontFamily: F }}>Ya tenés una sesión activa.</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-md px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: C.navy, fontFamily: F }}
            >
              Ir al Dashboard <ArrowRight className="inline h-4 w-4 ml-1" />
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── Helper: tarjeta de sistema (Gate-style) ──
  const SystemAccessCard = ({ k, areaKey }: { k: keyof typeof SYS; areaKey: SystemArea }) => {
    const s = SYS[k];
    const Icon = s.icon;
    return (
      <button
        onClick={() => handleGoogleLogin("/dashboard", areaKey)}
        className="w-full flex items-center gap-4 rounded-md border-2 px-5 py-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
        style={{ background: C.card, borderColor: C.border, fontFamily: F }}
      >
        <div className="h-11 w-11 rounded-md flex items-center justify-center shrink-0"
          style={{ background: s.tint }}>
          <Icon className="h-5 w-5" style={{ color: s.color }} strokeWidth={2} />
        </div>
        <div className="flex-1">
          <p className="text-[15px] font-bold" style={{ color: C.text }}>{s.label}</p>
          <p className="text-[12px]" style={{ color: C.muted }}>{s.area}</p>
        </div>
        <ArrowRight className="h-4 w-4" style={{ color: s.color }} />
      </button>
    );
  };

  const isMainView = view === "main";

  return (
    <div className="flex min-h-screen flex-col" style={{ background: C.bg, fontFamily: F }}>
      {/* Dark mode toggle */}
      <button
        onClick={toggleDark}
        className="fixed top-4 right-4 z-50 h-10 w-10 rounded-md flex items-center justify-center transition-all hover:scale-105"
        style={{ background: C.card, border: `1px solid ${C.border}`, color: C.muted }}
        aria-label="Toggle dark mode"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <main className="flex flex-1 flex-col">
        {/* ═══════════════ MAIN VIEW — Hero Gate Split-Screen ═══════════════ */}
        {isMainView && (
          <>
            <section ref={heroRef} className="grid lg:grid-cols-2 min-h-screen">
              {/* Lado izquierdo decorativo */}
              <div
                className="hidden lg:flex relative flex-col justify-between p-12 text-white overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyHover} 100%)` }}
              >
                <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 800 800" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <pattern id="grid-login" width="60" height="60" patternUnits="userSpaceOnUse">
                      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="800" height="800" fill="url(#grid-login)" />
                  <path d="M0,500 Q200,400 400,500 T800,480 L800,800 L0,800 Z" fill="white" fillOpacity="0.06" />
                  <path d="M0,600 Q200,520 400,600 T800,580 L800,800 L0,800 Z" fill="white" fillOpacity="0.04" />
                </svg>

                <div className="relative z-10">
                  <PsiLogo size="lg" className="!items-start" />
                  <p className="text-base mt-3 text-white/85">Plataforma de Sistemas Interactivos</p>
                  <p className="text-[15px] mt-6 max-w-md text-white/75 leading-relaxed">
                    Un entorno único, confidencial y seguro para acompañar tu proceso clínico, psicodiagnóstico o forense.
                  </p>
                </div>

                <div className="relative z-10 space-y-4">
                  {(["reflexionar", "evaluar", "acompanar"] as const).map((k) => {
                    const s = SYS[k];
                    const Icon = s.icon;
                    return (
                      <div key={k} className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-md flex items-center justify-center shrink-0"
                          style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>
                          <Icon className="h-5 w-5 text-white" strokeWidth={1.8} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{s.label}</p>
                          <p className="text-xs text-white/70">{s.area}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="relative z-10 flex items-center gap-2 text-xs text-white/60">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Datos protegidos · Ley 25.326 · Santa Fe, Argentina</span>
                </div>
              </div>

              {/* Lado derecho — selección de acceso */}
              <div className="flex items-center justify-center p-6 sm:p-12" style={{ background: C.card }}>
                <div className="w-full max-w-md space-y-6 animate-fade-in">
                  {/* Logo móvil */}
                  <div className="lg:hidden text-center mb-2">
                    <PsiLogo size="md" />
                    <p className="text-xs mt-2" style={{ color: C.muted }}>Plataforma de Sistemas Interactivos</p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="inline-block rounded-md px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[1.2px]"
                      style={{ background: C.bgTint, color: C.navy }}>
                      Bienvenido/a
                    </span>
                    <h2 className="text-[26px] font-bold leading-tight" style={{ color: C.text, letterSpacing: "-0.5px" }}>
                      ¿Cómo querés ingresar?
                    </h2>
                    <p className="text-[14px]" style={{ color: C.muted }}>
                      Elegí el tipo de acceso que corresponde a tu rol.
                    </p>
                  </div>

                  {/* Botón principal: Paciente */}
                  <button
                    onClick={() => setView("paciente")}
                    className="w-full flex items-center gap-3 rounded-md px-5 py-3.5 text-left text-white transition-all hover:opacity-90 active:scale-[0.99]"
                    style={{ background: C.navy }}
                  >
                    <div className="h-10 w-10 rounded-md flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.18)" }}>
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <span className="text-[15px] font-bold block">Soy Paciente</span>
                      <span className="text-[12px] text-white/75">Accedé a tu sistema asignado</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/70" />
                  </button>

                  {/* Botón Profesional */}
                  <button
                    onClick={() => navigate("/profesional")}
                    className="w-full flex items-center justify-center gap-2 rounded-md border-2 px-4 py-3 text-sm font-semibold transition-all hover:opacity-80 active:scale-[0.98]"
                    style={{ borderColor: C.gold, color: C.gold, background: "rgba(160,124,46,0.04)" }}
                  >
                    <Briefcase className="h-4 w-4" /> Soy Profesional
                  </button>

                  <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t" style={{ borderColor: C.border }} />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-3 text-[11px] uppercase tracking-[1.5px]" style={{ color: C.muted, background: C.card }}>
                        más opciones
                      </span>
                    </div>
                  </div>

                  <a href="#sistemas" className="block text-center text-xs font-medium transition-colors hover:opacity-70" style={{ color: C.muted }}>
                    Conocer los tres sistemas ↓
                  </a>

                  <div className="flex items-start gap-2 pt-2 border-t" style={{ borderColor: C.border }}>
                    <ShieldCheck className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: C.navy }} />
                    <p className="text-[11px] leading-relaxed" style={{ color: C.muted }}>
                      Al ingresar aceptás nuestra{" "}
                      <Link to="/privacy-policy" className="underline" style={{ color: C.navy }}>
                        Política de Privacidad
                      </Link>{" "}
                      y el cumplimiento de la Ley N° 25.326 de Protección de Datos Personales.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Tres sistemas — tabs estilo Gate */}
            <SystemTabs />

            {/* Métricas */}
            <section className="py-12 px-5" style={{ background: C.card }}>
              <div className="mx-auto max-w-5xl">
                <div className="rounded-lg p-6" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                  <ProfessionalStats />
                </div>
              </div>
            </section>

            {/* Avales */}
            <section className="py-12 px-5" style={{ background: C.bg }}>
              <div className="mx-auto max-w-3xl">
                <h2 className="text-center text-[20px] font-semibold mb-8" style={{ color: C.text }}>
                  Reconocimiento institucional
                </h2>
                <div className="space-y-4">
                  {[
                    { logo: logoALPJF, name: "Asociación Latinoamericana de Psicología Jurídica y Forense", invert: false },
                    { logo: logoAPFRA, name: "Asociación de Psicólogos Forenses de la República Argentina", invert: true },
                  ].map((inst, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg"
                      style={{ background: C.card, border: `1px solid ${C.border}` }}>
                      <img src={inst.logo} alt={inst.name} className={`h-10 w-10 object-contain shrink-0 ${inst.invert ? "dark:invert" : ""}`} />
                      <span className="text-[14px] font-medium" style={{ color: C.text }}>{inst.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="py-12 px-5" style={{ background: C.card }}>
              <div className="mx-auto max-w-3xl">
                <h2 className="text-center text-[20px] font-semibold mb-8" style={{ color: C.text }}>
                  Preguntas frecuentes
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} style={{ borderColor: C.border }}>
                      <AccordionTrigger className="text-[14px] font-medium hover:no-underline py-4" style={{ color: C.text }}>
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-[14px] leading-relaxed pb-4" style={{ color: C.muted }}>
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>

            {/* CTA Final */}
            <section className="py-16 px-5" style={{ background: C.navy }}>
              <div className="mx-auto max-w-2xl text-center space-y-5">
                <h2 className="text-[24px] md:text-[28px] font-bold text-white">
                  Cuidar tu salud mental es prioridad.
                </h2>
                <p className="text-[15px] leading-relaxed text-white/75">
                  <span style={{ color: "#E8D48A", fontWeight: 700 }}>.PSI.</span>{" "}
                  acompaña tu proceso con seriedad clínica, ética y confidencialidad.
                </p>
                <a
                  href={CALENDAR_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: C.card, color: C.navy }}
                >
                  Solicitar Turno <Calendar className="h-4 w-4" />
                </a>
              </div>
            </section>

            {/* Footer institucional */}
            <Footer />
          </>
        )}

        {/* ═══════════════ AFTER SELECTING (Paciente / Consulta / Empresa) ═══════════════ */}
        {!isMainView && (
          <>
            {/* Header unificado */}
            <section className="w-full" style={{ background: C.card, borderBottom: `1px solid ${C.border}` }}>
              <div className="mx-auto max-w-2xl px-5 pt-10 pb-8">
                <div className="text-center mb-6 animate-fade-in">
                  <PsiLogo size="lg" />
                  <p className="text-xs md:text-sm font-medium tracking-[0.15em] uppercase mt-2" style={{ color: C.gold }}>
                    Plataforma de Sistemas Interactivos
                  </p>
                </div>

                {/* Sistemas Paciente */}
                {view === "paciente" && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="text-center mb-4">
                      <span className="inline-block rounded-md px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[1.2px]"
                        style={{ background: C.bgTint, color: C.navy }}>
                        Acceso Paciente
                      </span>
                      <h2 className="text-[22px] font-bold mt-2" style={{ color: C.text }}>
                        Elegí tu sistema asignado
                      </h2>
                      <p className="text-[13px] mt-1" style={{ color: C.muted }}>
                        Continuá con Google para ingresar.
                      </p>
                    </div>
                    <SystemAccessCard k="reflexionar" areaKey="reflexionar" />
                    <SystemAccessCard k="evaluar" areaKey="evaluar" />
                    <SystemAccessCard k="acompanar" areaKey="acompanar" />
                  </div>
                )}

                {/* Botón volver */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setView("main")}
                    className="flex items-center gap-2 rounded-md border px-5 py-2 text-sm font-semibold transition-all hover:opacity-80"
                    style={{ borderColor: C.border, color: C.muted, background: C.card }}
                  >
                    <ArrowLeft className="h-4 w-4" /> Volver al inicio
                  </button>
                </div>
              </div>
            </section>

            {/* Privacy footer */}
            <div className="mx-auto mb-10 mt-2 flex max-w-2xl items-start gap-2 rounded-md px-5 py-3 mx-5"
              style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" style={{ color: C.navy }} />
              <p className="text-[12px]" style={{ color: C.muted }}>
                Tus datos están protegidos. Al ingresar aceptás los{" "}
                <Link to="/privacy-policy" className="underline font-medium" style={{ color: C.navy }}>
                  Términos, Condiciones y Política de Privacidad
                </Link>.
              </p>
            </div>

            <Footer />
          </>
        )}
      </main>
    </div>
  );
};

// Componente Tabs unificado
const SystemTabs = () => {
  const [tab, setTab] = useState<keyof typeof SYS>("reflexionar");
  const order: (keyof typeof SYS)[] = ["reflexionar", "evaluar", "acompanar"];
  const features: Record<keyof typeof SYS, string[]> = {
    reflexionar: [
      "Termómetro emocional diario y registro inconsciente",
      "Entrenamiento cognitivo (modelo ABCDE)",
      "Mi cuaderno: espacio privado de escritura",
      "Seguimiento de turnos y evolución",
    ],
    evaluar: [
      "MMPI-2, MBTI, MCMI-III y SCL-90-R",
      "Consentimiento informado integrado",
      "Generación de informe profesional en PDF",
      "Historial de evaluaciones por paciente",
    ],
    acompanar: [
      "Gestión de causas judiciales por CUIJ",
      "Documentación Cámara Gesell",
      "Apto psicológico y junta médica laboral",
      "Análisis de testimonio asistido",
    ],
  };
  const s = SYS[tab];
  const Icon = s.icon;

  return (
    <section id="sistemas" className="py-14 px-5" style={{ background: C.bg }}>
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-[20px] font-semibold mb-8" style={{ color: C.text, fontFamily: F }}>
          Tres sistemas. Una plataforma integrada.
        </h2>

        <div className="flex border-b overflow-x-auto" style={{ borderColor: C.border }}>
          {order.map((k) => {
            const item = SYS[k];
            const active = tab === k;
            return (
              <button
                key={k}
                onClick={() => setTab(k)}
                className="px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors"
                style={{
                  fontFamily: F,
                  color: active ? C.text : C.muted,
                  borderBottom: active ? `2px solid ${item.color}` : "2px solid transparent",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="py-8 animate-fade-in" key={tab}>
          <div className="flex items-start gap-4 mb-2">
            <div className="h-10 w-10 rounded-md flex items-center justify-center shrink-0" style={{ background: s.tint }}>
              <Icon className="h-5 w-5" style={{ color: s.color }} />
            </div>
            <div>
              <h3 className="text-[16px] font-semibold" style={{ color: C.text, fontFamily: F }}>
                {s.label} — {s.area}
              </h3>
              <p className="text-[14px] mt-1 leading-relaxed" style={{ color: C.muted, fontFamily: F }}>
                {s.desc}
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-2.5 pl-14">
            <p className="text-[11px] font-semibold uppercase tracking-[1.2px]" style={{ color: C.muted, fontFamily: F }}>
              Incluye
            </p>
            {features[tab].map((f, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <Check className="h-4 w-4 shrink-0 mt-0.5" style={{ color: s.color }} />
                <span className="text-[14px]" style={{ color: C.text, fontFamily: F }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
