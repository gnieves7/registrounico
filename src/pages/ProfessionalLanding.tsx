import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  ShieldCheck, Lock, BarChart3, Scale, Activity,
  Briefcase, GraduationCap, Building2, ChevronRight,
  MessageCircle, Mail, Globe, ArrowRight, Check,
  User, BookOpen, Heart, Eye
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import logoALPJF from "@/assets/logo_ALPJF.png";
import logoAPFRA from "@/assets/logo_APFRA.png";

const WHATSAPP_LINK = "https://wa.me/5493426272158";
const EMPRESA_EMAIL = "pdf.consultas@gmail.com";
const EMPRESA_WEB = "https://www.psicodiagnostico-forense.com.ar";

const ProfessionalLanding = () => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "", license: "", province: "", email: "", plan: "", message: ""
  });

  const handleSubmitAccess = () => {
    if (!formData.fullName || !formData.email || !formData.license) {
      toast.error("Completá nombre, matrícula y email");
      return;
    }
    const msg = encodeURIComponent(
      `Solicitud de acceso profesional:\nNombre: ${formData.fullName}\nMatrícula: ${formData.license} (${formData.province})\nEmail: ${formData.email}\nPlan: ${formData.plan || "Sin definir"}\nMensaje: ${formData.message || "—"}`
    );
    window.open(`https://wa.me/5493426272158?text=${msg}`, "_blank");
    setShowAccessModal(false);
    toast.success("Redirigido a WhatsApp para completar tu solicitud");
  };

  const systems = [
    {
      title: "Reflexionar — Sistema de Práctica Clínica",
      icon: Heart,
      description: "Registro de sesiones, seguimiento de procesos terapéuticos, notas clínicas estructuradas y evolución del paciente. Diseñado para la práctica individual con encuadre ético.",
      features: [
        "Fichas de pacientes con historial cronológico",
        "Registro de sesiones con campos clínicos (motivo, intervención, plan)",
        "Alertas de seguimiento y próximas citas",
        "Generación de informes de evolución en PDF",
        "Journaling guiado para el paciente (módulo opcional)",
      ],
    },
    {
      title: "Evaluar — Sistema de Psicodiagnóstico",
      icon: BarChart3,
      description: "Administración asistida de instrumentos estandarizados, puntuación automatizada e informes diagnósticos formales.",
      features: [
        "Asistente MMPI-2 con perfiles y puntuaciones T",
        "Módulo Rorschach — Sistema Comprehensivo de Exner",
        "MCMI-III y pruebas complementarias",
        "Generación de informe clínico en formato profesional (PDF)",
        "Historial de evaluaciones por paciente",
      ],
    },
    {
      title: "Acompañar — Sistema de Psicología Forense",
      icon: Scale,
      description: "Gestión de causas judiciales, producción de informes periciales y consultoría técnica en el marco del proceso penal y de familia.",
      features: [
        "Registro de causas por CUIJ/expediente",
        "Plantillas de informes periciales (capacidad, credibilidad, daño)",
        "Análisis CBCA/SVA asistido para evaluación de testimonio",
        "Gestión de Cámara Gesell y entrevistas forenses",
        "Historial de intervenciones por causa",
      ],
    },
  ];

  const profiles = [
    { icon: User, title: "Psicólogo/a clínico/a", subtitle: "en práctica privada", desc: "Con pacientes en consulta individual o grupal que necesita gestión organizada y generación de informes." },
    { icon: Scale, title: "Perito y consultor forense", subtitle: "", desc: "Profesional que actúa en procesos judiciales penales, de familia o laborales como perito oficial o consultor técnico." },
    { icon: Briefcase, title: "Evaluador corporativo", subtitle: "", desc: "Psicólogo que realiza selección de personal, evaluaciones de aptitud o seguimiento de equipos en organizaciones." },
    { icon: GraduationCap, title: "Docente e investigador", subtitle: "", desc: "Profesional que necesita un entorno controlado para administrar pruebas en contextos académicos o de investigación." },
  ];

  const faqItems = [
    { q: "¿Puedo probar la plataforma antes de contratar?", a: "Sí, ofrecemos una demostración personalizada donde podés ver el funcionamiento completo de los tres sistemas. Contactanos para coordinar." },
    { q: "¿Los datos de mis pacientes están seguros? ¿Cumplen con la Ley 25.326?", a: "Absolutamente. Toda la información es cifrada, almacenada en servidores seguros y cumple con la Ley 25.326 de Protección de Datos Personales y estándares internacionales de datos en salud." },
    { q: "¿Puedo acceder desde tablet o celular además de PC?", a: "Sí, .PSI. es una plataforma web responsive optimizada para cualquier dispositivo. No necesitás instalar ninguna aplicación." },
    { q: "¿Los informes generados son editables?", a: "Los informes se generan en formato PDF profesional listo para presentar. Los datos de entrada son editables antes de la generación final del documento." },
    { q: "¿Puedo usar .PSI. si trabajo en varias jurisdicciones?", a: "Sí, la plataforma se adapta a diferentes marcos normativos. Los informes pueden ajustarse según la jurisdicción correspondiente." },
    { q: "¿Qué pasa con mis datos si cancelo el plan?", a: "Tus datos permanecen accesibles durante 90 días después de la cancelación. Podés solicitar una exportación completa en cualquier momento." },
    { q: "¿Hay descuento para residentes o psicólogos en formación?", a: "Sí, contamos con tarifas especiales para profesionales en formación. Consultá por los requisitos y documentación necesaria." },
    { q: "¿Ofrecen capacitación o instructivo de uso?", a: "Sí, incluimos onboarding personalizado, videotutoriales y soporte continuo para que aproveches todas las funcionalidades." },
  ];

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#F8F7F4" }}>
      {/* [1] NAVBAR */}
      <nav className="sticky top-0 z-50 w-full border-b" style={{ background: "#F8F7F4", borderColor: "#E2DED8" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/login" className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: "#A07C2E" }}>
            .PSI.
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/demo")}
              className="rounded-md border px-4 py-2 text-sm font-semibold transition-all hover:opacity-90"
              style={{ borderColor: "#A07C2E", color: "#A07C2E", fontFamily: "'DM Sans', sans-serif", borderRadius: "6px" }}
            >
              <Eye className="inline h-3.5 w-3.5 mr-1" />
              Probar gratis
            </button>
            <button
              onClick={() => signInWithGoogle()}
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setShowAccessModal(true)}
              className="rounded-md px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "#1C3F6E", fontFamily: "'DM Sans', sans-serif", borderRadius: "6px" }}
            >
              Contratar acceso <ArrowRight className="inline h-3.5 w-3.5 ml-1" />
            </button>
          </div>
        </div>
      </nav>

      {/* [2] HERO */}
      <section className="py-16 md:py-20 px-5">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <span
            className="inline-block rounded-md px-3 py-1 text-[11px] font-semibold uppercase tracking-[1.2px]"
            style={{ background: "#EEF3FA", color: "#1C3F6E", fontFamily: "'DM Sans', sans-serif" }}
          >
            Acceso Profesional
          </span>
          <h1
            className="text-[28px] md:text-[36px] font-bold leading-tight"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#1A1A1A", letterSpacing: "-0.5px" }}
          >
            Gestión clínica, psicodiagnóstico{" "}
            <br className="hidden md:block" />
            y pericia forense — en una sola plataforma.
          </h1>
          <p
            className="text-[15px] leading-relaxed max-w-xl mx-auto"
            style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif", lineHeight: "1.6" }}
          >
            <span style={{ color: "#A07C2E", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>.PSI.</span>{" "}
            integra tres sistemas especializados para que cada área de tu práctica profesional dialogue con las demás.
            Diseñada por y para psicólogos en ejercicio real.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowAccessModal(true)}
              className="w-full sm:w-auto rounded-md px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "#1C3F6E", borderRadius: "6px", fontFamily: "'DM Sans', sans-serif" }}
            >
              Solicitar acceso profesional <ArrowRight className="inline h-4 w-4 ml-1" />
            </button>
            <a
              href="#planes"
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}
            >
              Ver planes y precios ↓
            </a>
          </div>
          <div className="flex items-center justify-center gap-2 pt-4">
            <Lock className="h-3.5 w-3.5" style={{ color: "#6B6B6B" }} />
            <span className="text-[12px]" style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}>
              Datos protegidos · Ley 25.326 · Plataforma de uso exclusivo para profesionales matriculados
            </span>
          </div>
        </div>
      </section>

      {/* [3] TRES SISTEMAS — Tabs */}
      <section className="py-12 px-5" style={{ background: "#FFFFFF" }}>
        <div className="mx-auto max-w-4xl">
          <h2
            className="text-center text-[20px] font-semibold mb-8"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#1A1A1A" }}
          >
            Tres sistemas. Una práctica integrada.
          </h2>

          {/* Tab headers */}
          <div className="flex border-b overflow-x-auto" style={{ borderColor: "#E2DED8" }}>
            {["Reflexionar", "Evaluar", "Acompañar"].map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className="px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: activeTab === i ? "#1A1A1A" : "#6B6B6B",
                  borderBottom: activeTab === i ? "2px solid #1C3F6E" : "2px solid transparent",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="py-8 animate-fade-in" key={activeTab}>
            <div className="flex items-start gap-4 mb-4">
              {(() => { const Icon = systems[activeTab].icon; return <Icon className="h-6 w-6 shrink-0 mt-0.5" style={{ color: "#1C3F6E" }} />; })()}
              <div>
                <h3 className="text-[16px] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif", color: "#1A1A1A" }}>
                  {systems[activeTab].title}
                </h3>
                <p className="text-[15px] mt-2 leading-relaxed" style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}>
                  {systems[activeTab].description}
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-2.5 pl-10">
              <p className="text-[11px] font-semibold uppercase tracking-[1.2px]" style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}>
                Incluye
              </p>
              {systems[activeTab].features.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#1C3F6E" }} />
                  <span className="text-[14px]" style={{ color: "#1A1A1A", fontFamily: "'DM Sans', sans-serif" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* [4] PARA QUIÉN ES */}
      <section className="py-12 px-5" style={{ background: "#F8F7F4" }}>
        <div className="mx-auto max-w-4xl">
          <h2
            className="text-center text-[20px] font-semibold mb-8"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#1A1A1A" }}
          >
            ¿Para qué tipo de profesional está diseñada?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {profiles.map((p, i) => (
              <div
                key={i}
                className="rounded-lg p-5 transition-all hover:-translate-y-0.5"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2DED8",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
                }}
              >
                <p.icon className="h-5 w-5 mb-3" style={{ color: "#1C3F6E" }} />
                <h3 className="text-[15px] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif", color: "#1A1A1A" }}>
                  {p.title}
                </h3>
                {p.subtitle && (
                  <p className="text-[13px] font-medium" style={{ color: "#1C3F6E" }}>{p.subtitle}</p>
                )}
                <p className="text-[13px] mt-2 leading-relaxed" style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* [5] MÉTRICAS */}
      <section className="py-12 px-5" style={{ background: "#FFFFFF" }}>
        <div className="mx-auto max-w-4xl text-center">
          <h2
            className="text-[20px] font-semibold mb-2"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#1A1A1A" }}
          >
            Fundada en práctica clínica real
          </h2>
          <p className="text-[15px] max-w-lg mx-auto mb-10" style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif", lineHeight: "1.6" }}>
            <span style={{ color: "#A07C2E", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>.PSI.</span>{" "}
            fue desarrollada desde el ejercicio profesional activo, no desde un laboratorio de software.
            Cada módulo responde a necesidades reales de la práctica clínica y forense.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "+365", label: "Procesos terapéuticos" },
              { value: "+126", label: "Cámara Gesell y pericias" },
              { value: "+487", label: "Informes psicoforenses" },
              { value: "+375", label: "Evaluaciones psicodiagnósticas" },
            ].map((s, i) => (
              <div key={i} className="space-y-1">
                <span className="text-[28px] md:text-[32px] font-bold" style={{ color: "#1C3F6E", fontFamily: "'DM Sans', sans-serif" }}>
                  {s.value}
                </span>
                <p className="text-[13px]" style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[11px] mt-6" style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}>
            Datos acumulados en la trayectoria del Lic. Esp. Germán H. Nieves · Mat. N° 1889
          </p>
        </div>
      </section>

      {/* [6] PLANES Y PRECIOS */}
      <section id="planes" className="py-12 px-5" style={{ background: "#F8F7F4" }}>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-[20px] font-semibold mb-1" style={{ fontFamily: "'DM Sans', sans-serif", color: "#1A1A1A" }}>
            Acceso profesional
          </h2>
          <p className="text-[15px] mb-8" style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}>
            Sin permanencia. Sin letra chica. Cancelás cuando querés.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Plan Básico */}
            <div className="rounded-lg p-6 text-left" style={{ background: "#FFFFFF", border: "1px solid #E2DED8", borderRadius: "8px" }}>
              <p className="text-[11px] font-semibold uppercase tracking-[1.2px] mb-2" style={{ color: "#6B6B6B" }}>Plan Básico</p>
              <p className="text-[20px] font-bold mb-4" style={{ color: "#1A1A1A" }}>Precio de lanzamiento</p>
              <ul className="space-y-2 mb-6">
                {["Sistema Reflexionar completo", "Hasta 30 pacientes activos", "Informes PDF básicos", "Soporte por email"].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-[14px]" style={{ color: "#1A1A1A", fontFamily: "'DM Sans', sans-serif" }}>
                    <Check className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#1C3F6E" }} /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => { setFormData(prev => ({ ...prev, plan: "Básico" })); setShowAccessModal(true); }}
                className="w-full rounded-md px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: "#EEF3FA", color: "#1C3F6E", borderRadius: "6px", fontFamily: "'DM Sans', sans-serif" }}
              >
                Consultar
              </button>
            </div>
            {/* Plan Profesional — Destacado */}
            <div className="rounded-lg p-6 text-left relative" style={{ background: "#FFFFFF", border: "2px solid #1C3F6E", borderRadius: "8px" }}>
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-md px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
                style={{ background: "#1C3F6E" }}
              >
                Más elegido
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-[1.2px] mb-2" style={{ color: "#1C3F6E" }}>Plan Profesional</p>
              <p className="text-[20px] font-bold mb-4" style={{ color: "#1A1A1A" }}>Precio de lanzamiento</p>
              <ul className="space-y-2 mb-6">
                {["Los 3 Sistemas completos", "Pacientes ilimitados", "Informes PDF y Word", "Módulo forense completo", "Soporte prioritario", "Actualizaciones incluidas"].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-[14px]" style={{ color: "#1A1A1A", fontFamily: "'DM Sans', sans-serif" }}>
                    <Check className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#1C3F6E" }} /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => { setFormData(prev => ({ ...prev, plan: "Profesional" })); setShowAccessModal(true); }}
                className="w-full rounded-md px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "#1C3F6E", borderRadius: "6px", fontFamily: "'DM Sans', sans-serif" }}
              >
                Contratar Plan Profesional <ArrowRight className="inline h-3.5 w-3.5 ml-1" />
              </button>
            </div>
            {/* Plan Institucional */}
            <div className="rounded-lg p-6 text-left" style={{ background: "#FFFFFF", border: "1px solid #E2DED8", borderRadius: "8px" }}>
              <p className="text-[11px] font-semibold uppercase tracking-[1.2px] mb-2" style={{ color: "#6B6B6B" }}>Plan Institucional</p>
              <p className="text-[20px] font-bold mb-4" style={{ color: "#1A1A1A" }}>A convenir</p>
              <ul className="space-y-2 mb-6">
                {["Multi-usuario", "Equipos y supervisión", "Integración a sistemas institucionales", "Facturación a entidad"].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-[14px]" style={{ color: "#1A1A1A", fontFamily: "'DM Sans', sans-serif" }}>
                    <Check className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#1C3F6E" }} /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => { setFormData(prev => ({ ...prev, plan: "Institucional" })); setShowAccessModal(true); }}
                className="w-full rounded-md px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: "#EEF3FA", color: "#1C3F6E", borderRadius: "6px", fontFamily: "'DM Sans', sans-serif" }}
              >
                Consultar
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-6">
            <Lock className="h-3.5 w-3.5" style={{ color: "#6B6B6B" }} />
            <span className="text-[12px]" style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}>
              Pago seguro · Renovación mensual · Cancelación sin costo · Facturación disponible para profesionales autónomos y personas jurídicas.
            </span>
          </div>
        </div>
      </section>

      {/* [7] AVALES */}
      <section className="py-12 px-5" style={{ background: "#FFFFFF" }}>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-[20px] font-semibold mb-8" style={{ fontFamily: "'DM Sans', sans-serif", color: "#1A1A1A" }}>
            Reconocimiento y membresía institucional
          </h2>
          <div className="space-y-4">
            {[
              { logo: logoALPJF, name: "Asociación Latinoamericana de Psicología Jurídica y Forense", invert: false },
              { logo: logoAPFRA, name: "Asociación de Psicólogos Forenses de la República Argentina", invert: true },
            ].map((inst, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-lg"
                style={{ border: "1px solid #E2DED8", borderRadius: "8px", background: "#FFFFFF" }}
              >
                <img src={inst.logo} alt={inst.name} className={`h-10 w-10 object-contain shrink-0 ${inst.invert ? "dark:invert" : ""}`} />
                <span className="text-[14px] font-medium" style={{ color: "#1A1A1A", fontFamily: "'DM Sans', sans-serif" }}>
                  {inst.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* [8] FAQ */}
      <section className="py-12 px-5" style={{ background: "#F8F7F4" }}>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-[20px] font-semibold mb-8" style={{ fontFamily: "'DM Sans', sans-serif", color: "#1A1A1A" }}>
            Preguntas frecuentes
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} style={{ borderColor: "#E2DED8" }}>
                <AccordionTrigger
                  className="text-[14px] font-medium hover:no-underline py-4"
                  style={{ color: "#1A1A1A", fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item.q}
                </AccordionTrigger>
                <AccordionContent
                  className="text-[14px] leading-relaxed pb-4"
                  style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* [9] CTA FINAL */}
      <section className="py-16 px-5" style={{ background: "#1C3F6E" }}>
        <div className="mx-auto max-w-2xl text-center space-y-5">
          <h2 className="text-[24px] md:text-[28px] font-bold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Empezá a ordenar tu práctica hoy.
          </h2>
          <p className="text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.75)", fontFamily: "'DM Sans', sans-serif" }}>
            <span style={{ color: "#E8D48A", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>.PSI.</span>{" "}
            es la plataforma que faltaba para psicólogos que ejercen con seriedad clínica, forense y ética.
          </p>
          <button
            onClick={() => setShowAccessModal(true)}
            className="rounded-md px-6 py-3 text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "#FFFFFF", color: "#1C3F6E", borderRadius: "6px", fontFamily: "'DM Sans', sans-serif" }}
          >
            Solicitar acceso profesional <ArrowRight className="inline h-4 w-4 ml-1" />
          </button>
          <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
            Respuesta en menos de 24 horas hábiles.
          </p>
        </div>
      </section>

      {/* [10] FOOTER */}
      <footer className="py-10 px-5" style={{ background: "#F8F7F4", borderTop: "1px solid #E2DED8" }}>
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <p className="text-[20px] font-bold" style={{ color: "#A07C2E", fontFamily: "'Playfair Display', serif" }}>
            .PSI.
          </p>
          <p className="text-[13px]" style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}>
            Plataforma de Sistemas Interactivos
          </p>
          <div className="text-[13px] leading-relaxed" style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}>
            <p className="font-medium" style={{ color: "#1A1A1A" }}>Desarrollada por:</p>
            <p>Lic. Esp. Germán H. Nieves</p>
            <p>Psicólogo Clínico · Especialista en Psicología Forense</p>
            <p>Mat. N° 1889 · Colegio de Psicólogos de Santa Fe</p>
            <p>Universidad Nacional de Rosario</p>
          </div>
          <div className="flex items-center justify-center gap-4 text-[13px]" style={{ color: "#6B6B6B" }}>
            <a href={`mailto:${EMPRESA_EMAIL}`} className="hover:opacity-70 transition-opacity flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" /> {EMPRESA_EMAIL}
            </a>
            <a href={EMPRESA_WEB} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" /> Sitio Web
            </a>
          </div>
          <div className="flex items-center justify-center gap-4 text-[12px]" style={{ color: "#6B6B6B" }}>
            <Link to="/privacy-policy" className="hover:underline">Política de Privacidad</Link>
            <span>·</span>
            <span>Términos de Uso</span>
            <span>·</span>
            <span>Aviso Legal</span>
          </div>
          <p className="text-[11px]" style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}>
            © 2026 .PSI. Esta plataforma acompaña la práctica profesional, no la sustituye.
            Los contenidos no reemplazan el criterio clínico del profesional matriculado.
          </p>
        </div>
      </footer>

      {/* Modal de solicitud de acceso */}
      <Dialog open={showAccessModal} onOpenChange={setShowAccessModal}>
        <DialogContent className="sm:max-w-md" style={{ background: "#FFFFFF" }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'DM Sans', sans-serif", color: "#1A1A1A" }}>
              Solicitar acceso profesional
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-[13px] font-medium" style={{ color: "#1A1A1A" }}>Nombre completo *</Label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Lic. Nombre Apellido"
                style={{ borderColor: "#E2DED8", borderRadius: "6px" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium" style={{ color: "#1A1A1A" }}>Matrícula *</Label>
                <Input
                  value={formData.license}
                  onChange={(e) => setFormData(prev => ({ ...prev, license: e.target.value }))}
                  placeholder="N° de matrícula"
                  style={{ borderColor: "#E2DED8", borderRadius: "6px" }}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium" style={{ color: "#1A1A1A" }}>Provincia</Label>
                <Input
                  value={formData.province}
                  onChange={(e) => setFormData(prev => ({ ...prev, province: e.target.value }))}
                  placeholder="Santa Fe"
                  style={{ borderColor: "#E2DED8", borderRadius: "6px" }}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] font-medium" style={{ color: "#1A1A1A" }}>Email profesional *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="tu@email.com"
                style={{ borderColor: "#E2DED8", borderRadius: "6px" }}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] font-medium" style={{ color: "#1A1A1A" }}>Mensaje (opcional)</Label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="¿Alguna consulta o comentario?"
                rows={3}
                style={{ borderColor: "#E2DED8", borderRadius: "6px" }}
              />
            </div>
            <Button
              onClick={handleSubmitAccess}
              className="w-full text-sm font-semibold text-white"
              style={{ background: "#1C3F6E", borderRadius: "6px" }}
            >
              Enviar solicitud vía WhatsApp <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessionalLanding;
