import { useState } from "react";
import { SCHOOL_CONFIG, SCHOOL_LIST, type SchoolType } from "@/config/schools";
import { motion, AnimatePresence } from "framer-motion";

const previewFields: { label: string; termKey: keyof typeof SCHOOL_CONFIG.cognitive_behavioral.terms }[] = [
  { label: "Nueva ficha de…", termKey: "patient" },
  { label: "Motivo de consulta →", termKey: "intake" },
  { label: "Diagnóstico →", termKey: "diagnosis" },
  { label: "Objetivo principal →", termKey: "goal" },
  { label: "Intervención →", termKey: "intervention" },
  { label: "Registro de →", termKey: "progress" },
];

export function SchoolPreview() {
  const [active, setActive] = useState<SchoolType>("psychoanalytic");
  const school = SCHOOL_CONFIG[active];

  return (
    <section className="py-12 px-5" style={{ background: "#FFFFFF" }}>
      <div className="mx-auto max-w-4xl">
        <h2
          className="text-center text-[20px] font-semibold mb-2"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#1A1A1A" }}
        >
          Una plataforma que habla tu lenguaje clínico
        </h2>
        <p
          className="text-center text-[14px] max-w-lg mx-auto mb-8 leading-relaxed"
          style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}
        >
          <span style={{ color: "#A07C2E", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>.PSI.</span>{" "}
          se adapta a tu escuela de pensamiento. No es una app genérica: reconoce que un psicoanalista y un conductista
          no usan los mismos términos ni los mismos instrumentos.
        </p>

        {/* Tabs */}
        <div className="flex border-b overflow-x-auto gap-1" style={{ borderColor: "#E2DED8" }}>
          {SCHOOL_LIST.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className="px-4 py-2.5 text-[13px] font-medium whitespace-nowrap transition-all"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: active === s.id ? "#fff" : "#6B6B6B",
                background: active === s.id ? s.color : "transparent",
                borderBottom: active === s.id ? `2px solid ${s.color}` : "2px solid transparent",
                borderRadius: active === s.id ? "6px 6px 0 0" : "0",
              }}
            >
              <span className="mr-1.5">{s.icon}</span>
              {s.name}
            </button>
          ))}
        </div>

        {/* Preview card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mt-6 rounded-lg p-6"
            style={{ background: school.colorSoft, border: `1px solid ${school.color}20` }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{school.icon}</span>
              <span className="font-semibold text-[15px]" style={{ color: school.color, fontFamily: "'DM Sans', sans-serif" }}>
                {school.name}
              </span>
            </div>

            <div className="space-y-3">
              {previewFields.map((field) => (
                <div key={field.termKey} className="flex items-baseline gap-3">
                  <span className="text-[13px] shrink-0 w-40" style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}>
                    {field.label}
                  </span>
                  <span
                    className="text-[14px] font-medium capitalize"
                    style={{ color: school.color, fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {school.terms[field.termKey]}
                  </span>
                </div>
              ))}
            </div>

            {/* Instruments preview */}
            <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${school.color}15` }}>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B6B6B" }}>
                Instrumentos recomendados
              </p>
              <div className="flex flex-wrap gap-1.5">
                {school.instruments.available.slice(0, 5).map((inst) => (
                  <span
                    key={inst}
                    className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                    style={{ background: `${school.color}15`, color: school.color }}
                  >
                    ✅ {inst}
                  </span>
                ))}
              </div>
              {school.instruments.restricted.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {school.instruments.restricted.map((inst) => (
                    <span
                      key={inst}
                      className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                      style={{ background: "#f5f5f5", color: "#999" }}
                    >
                      🔒 {inst}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
