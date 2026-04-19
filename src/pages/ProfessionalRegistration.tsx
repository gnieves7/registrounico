import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { ShieldCheck, FileSignature, Loader2, ArrowLeft, BadgeCheck } from "lucide-react";
import jsPDF from "jspdf";

const CONSENT_VERSION = "1.0";

const ProfessionalRegistration = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const [form, setForm] = useState({
    fullName: "",
    dni: "",
    licenseNumber: "",
    licenseCollege: "",
    licenseJurisdiction: "Santa Fe",
    email: "",
    phone: "",
    accepted: false,
    signatureName: "",
    signatureDni: "",
  });

  useEffect(() => {
    if (!isLoading && !user) navigate("/profesional");
    if (user) {
      setForm((f) => ({ ...f, email: user.email || "" }));
      // If already registered, redirect
      supabase
        .from("profiles")
        .select("account_type, consent_accepted_at")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if ((data as any)?.account_type === "professional" && (data as any)?.consent_accepted_at) {
            navigate("/dashboard");
          }
        });
    }
  }, [user, isLoading, navigate]);

  const generateConsentPdf = (): Blob => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const margin = 18;
    let y = margin;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(".PSI. — Plataforma de Sistemas Interactivos", margin, y);
    y += 7;
    doc.setFontSize(11);
    doc.text("CONSENTIMIENTO INFORMADO PROFESIONAL", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Versión ${CONSENT_VERSION} — Documento firmado digitalmente`, margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Datos del profesional firmante", margin, y); y += 6;
    doc.setFont("helvetica", "normal");
    const rows = [
      ["Apellido y Nombre", form.fullName],
      ["DNI / CUIL", form.dni],
      ["Matrícula N°", form.licenseNumber],
      ["Colegio / Jurisdicción", `${form.licenseCollege} (${form.licenseJurisdiction})`],
      ["Correo electrónico", form.email],
      ["Teléfono", form.phone || "—"],
      ["Fecha de aceptación", new Date().toLocaleString("es-AR")],
    ];
    rows.forEach(([k, v]) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${k}:`, margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(v), margin + 55, y);
      y += 5;
    });

    y += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Declaración de Aceptación", margin, y); y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const declaration = doc.splitTextToSize(
      "En mi carácter de profesional habilitado/a para el ejercicio de la Psicología o disciplina afín, declaro haber leído, comprendido y aceptado en su totalidad el Consentimiento Informado Profesional de la plataforma .PSI. (Versión 1.0 — 2025). Manifiesto conocer mis derechos y obligaciones en relación al tratamiento de datos personales (Ley 25.326), al secreto profesional (art. 156 CP), a la ética profesional (Código FePRA, APFRA y Colegio de Psicólogos de Santa Fe Ley 9.538/10.772) y al marco normativo nacional e internacional aplicable. Acepto que el uso de la plataforma implica la vigencia plena del presente instrumento.",
      170
    );
    doc.text(declaration, margin, y);
    y += declaration.length * 4 + 6;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Firma digital tipeada", margin, y); y += 6;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(13);
    doc.text(form.signatureName, margin + 5, y); y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`DNI declarado en firma: ${form.signatureDni} — ${new Date().toLocaleString("es-AR")}`, margin, y);
    y += 10;

    doc.setFontSize(7);
    doc.setTextColor(120);
    doc.text(
      "Documento generado y firmado digitalmente en plataforma .PSI. (psi-gnieves.lovable.app).",
      margin, y
    );
    y += 3;
    doc.text(
      "Responsable: Lic. Esp. Germán H. Nieves — Mat. N° 1889 — Colegio de Psicólogos de Santa Fe.",
      margin, y
    );

    return doc.output("blob");
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (!form.fullName.trim() || !form.dni.trim() || !form.licenseNumber.trim() || !form.licenseCollege.trim()) {
      toast({ title: "Faltan datos", description: "Completá nombre, DNI, matrícula y colegio.", variant: "destructive" });
      return;
    }
    if (!form.accepted) {
      toast({ title: "Aceptá el consentimiento", description: "Debés marcar la casilla de aceptación.", variant: "destructive" });
      return;
    }
    if (form.signatureName.trim().toLowerCase() !== form.fullName.trim().toLowerCase()) {
      toast({ title: "Firma no coincide", description: "El nombre tipeado debe coincidir con tu nombre completo.", variant: "destructive" });
      return;
    }
    if (form.signatureDni.trim() !== form.dni.trim()) {
      toast({ title: "DNI no coincide", description: "El DNI tipeado en la firma debe coincidir con el declarado.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const pdfBlob = generateConsentPdf();
      const path = `${user.id}/consentimiento_${Date.now()}.pdf`;
      const { error: upErr } = await supabase.storage
        .from("consentimientos-profesionales")
        .upload(path, pdfBlob, { contentType: "application/pdf", upsert: false });
      if (upErr) throw upErr;

      const { error: consErr } = await supabase.from("professional_consents").insert({
        user_id: user.id,
        full_name: form.fullName.trim(),
        dni: form.dni.trim(),
        license_number: form.licenseNumber.trim(),
        license_college: form.licenseCollege.trim(),
        signature_typed: form.signatureName.trim(),
        pdf_storage_path: path,
        document_version: CONSENT_VERSION,
        user_agent: navigator.userAgent,
      } as any);
      if (consErr) throw consErr;

      const { error: profErr } = await supabase
        .from("profiles")
        .update({
          account_type: "professional",
          full_name: form.fullName.trim(),
          dni: form.dni.trim(),
          phone: form.phone.trim() || null,
          license_number: form.licenseNumber.trim(),
          license_college: form.licenseCollege.trim(),
          license_jurisdiction: form.licenseJurisdiction.trim(),
          consent_accepted_at: new Date().toISOString(),
          consent_signature_name: form.signatureName.trim(),
        } as any)
        .eq("user_id", user.id);
      if (profErr) throw profErr;

      // Ensure subscription row exists (handle_new_user trigger should have created it)
      await supabase.from("professional_subscriptions").upsert(
        { user_id: user.id } as any,
        { onConflict: "user_id", ignoreDuplicates: true } as any
      );

      toast({
        title: "Registro completado",
        description: "Tenés 3 meses gratis. El administrador revisará tu acceso.",
      });
      navigate("/pending-approval");
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error al registrar", description: err.message || "Intentá nuevamente.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen" style={{ background: "#F8F7F4" }}>
      <div className="max-w-3xl mx-auto px-5 py-10">
        <button
          onClick={() => navigate("/profesional")}
          className="flex items-center gap-2 text-sm font-medium mb-6 hover:opacity-70 transition-opacity"
          style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>

        <div className="text-center mb-8">
          <span
            className="inline-block rounded-md px-3 py-1 text-[11px] font-semibold uppercase tracking-[1.2px] mb-3"
            style={{ background: "#EEF3FA", color: "#1C3F6E", fontFamily: "'DM Sans', sans-serif" }}
          >
            Registro Profesional · 3 meses gratis
          </span>
          <h1 className="text-[28px] md:text-[34px] font-bold leading-tight" style={{ fontFamily: "'DM Sans', sans-serif", color: "#1A1A1A" }}>
            Habilitá tu acceso profesional a{" "}
            <span style={{ color: "#A07C2E", fontFamily: "'Playfair Display', serif" }}>.PSI.</span>
          </h1>
          <p className="text-[15px] mt-3 max-w-xl mx-auto" style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}>
            Acreditá tu matrícula y firmá digitalmente el consentimiento informado. Luego de los 3 meses gratuitos podrás continuar con USD 10/mes o USD 100/año.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <div
                className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: step >= n ? "#1C3F6E" : "#E2DED8",
                  color: step >= n ? "#fff" : "#6B6B6B",
                }}
              >
                {n}
              </div>
              <span className="text-xs font-medium" style={{ color: step >= n ? "#1A1A1A" : "#6B6B6B" }}>
                {n === 1 ? "Tus datos" : "Consentimiento"}
              </span>
              {n < 2 && <div className="h-px w-8" style={{ background: "#E2DED8" }} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <Card style={{ background: "#FFFFFF", border: "1px solid #E2DED8", borderRadius: "8px" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: "'DM Sans', sans-serif", color: "#1A1A1A" }}>
                <BadgeCheck className="h-5 w-5" style={{ color: "#1C3F6E" }} />
                Datos profesionales
              </CardTitle>
              <CardDescription style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}>
                Estos datos serán verificados por el administrador antes de habilitar tu acceso.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Nombre completo *</Label>
                  <Input id="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Apellido y Nombre" />
                </div>
                <div>
                  <Label htmlFor="dni">DNI / CUIL *</Label>
                  <Input id="dni" value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} placeholder="00.000.000" />
                </div>
                <div>
                  <Label htmlFor="license">Número de matrícula *</Label>
                  <Input id="license" value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} placeholder="Mat. N°" />
                </div>
                <div>
                  <Label htmlFor="college">Colegio profesional *</Label>
                  <Input id="college" value={form.licenseCollege} onChange={(e) => setForm({ ...form, licenseCollege: e.target.value })} placeholder="Colegio de Psicólogos de..." />
                </div>
                <div>
                  <Label htmlFor="jurisdiction">Jurisdicción</Label>
                  <Input id="jurisdiction" value={form.licenseJurisdiction} onChange={(e) => setForm({ ...form, licenseJurisdiction: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+54 9 ..." />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={form.email} disabled />
                </div>
              </div>
              <Button
                onClick={() => {
                  if (!form.fullName.trim() || !form.dni.trim() || !form.licenseNumber.trim() || !form.licenseCollege.trim()) {
                    toast({ title: "Completá los campos obligatorios", variant: "destructive" });
                    return;
                  }
                  setStep(2);
                }}
                className="w-full"
                style={{ background: "#1C3F6E", color: "#fff", borderRadius: "6px" }}
              >
                Continuar al consentimiento
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card style={{ background: "#FFFFFF", border: "1px solid #E2DED8", borderRadius: "8px" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: "'DM Sans', sans-serif", color: "#1A1A1A" }}>
                <FileSignature className="h-5 w-5" style={{ color: "#1C3F6E" }} />
                Consentimiento Informado Profesional
              </CardTitle>
              <CardDescription style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}>
                Leé íntegramente el documento y firmá digitalmente con tu nombre y DNI.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-72 rounded-md border p-4 text-sm leading-relaxed" style={{ borderColor: "#E2DED8", color: "#3a3a3a" }}>
                <h3 className="font-bold text-base mb-2">CONSENTIMIENTO INFORMADO PARA PROFESIONALES</h3>
                <p className="text-xs italic mb-3">Documento de ingreso y habilitación al uso de la plataforma — Versión 1.0 / 2025</p>

                <h4 className="font-bold mt-3">Preámbulo</h4>
                <p>La plataforma .PSI. — Plataforma de Sistemas Interactivos, desarrollada y administrada por el Lic. Esp. Germán H. Nieves (Mat. N° 1889, Colegio de Psicólogos de Santa Fe), constituye una herramienta de gestión clínica, psicodiagnóstica y forense de uso exclusivo para profesionales de la salud mental debidamente habilitados.</p>

                <h4 className="font-bold mt-3">I. Marco Normativo</h4>
                <p>Ley N° 25.326 (Protección de Datos), Ley N° 23.277 (Ejercicio de la Psicología), Ley N° 26.529/26.742 (Derechos del Paciente), Ley N° 27.553 (Telesalud), Ley N° 25.506 (Firma Digital), Ley N° 26.061 (Protección de NNyA), Código Civil y Comercial, Resolución AAIP N° 47/2018. Provincia de Santa Fe: Ley N° 10.772, Ley 9.538, Código de Ética del Colegio de Psicólogos. Internacional: GDPR (UE 2016/679), Principios IUPsyS, Código APA 2017, Declaración de Helsinki, OMS.</p>

                <h4 className="font-bold mt-3">II. Tratamiento de Datos</h4>
                <p>El profesional es el único responsable del ingreso, almacenamiento y gestión de los datos de sus pacientes. Garantiza haber obtenido el consentimiento informado de cada consultante. Los datos sensibles reciben protección reforzada (cifrado SSL/TLS, autenticación segura, RLS).</p>

                <h4 className="font-bold mt-3">III. Obligaciones Éticas</h4>
                <p>Competencia profesional, secreto profesional (art. 156 CP), no maleficencia, especial diligencia con NNyA y personas vulnerables. Uso responsable del asistente de IA (Laura): orientativo, no reemplaza juicio clínico, no ingresar datos identificatorios.</p>

                <h4 className="font-bold mt-3">IV. Derechos ARCO</h4>
                <p>Acceso, rectificación, cancelación, oposición y portabilidad de sus datos personales conforme Ley 25.326.</p>

                <h4 className="font-bold mt-3">V. Seguridad</h4>
                <p>Cifrado HTTPS/TLS, autenticación segura, RLS, backups, registro de auditoría, notificación de brechas.</p>

                <h4 className="font-bold mt-3">VI. Limitación de Responsabilidad</h4>
                <p>El administrador no asume responsabilidad por el contenido clínico ni los informes elaborados por el profesional usuario. El profesional es único responsable ante consultantes, organismos profesionales y la justicia.</p>

                <h4 className="font-bold mt-3">VII. Vigencia y Rescisión</h4>
                <p>Vigencia desde la aceptación. Modificaciones notificadas con 30 días de antelación. Rescisión libre por solicitud del profesional.</p>

                <h4 className="font-bold mt-3">VIII. Jurisdicción</h4>
                <p>Tribunales Ordinarios de la Ciudad de Santa Fe, Provincia de Santa Fe, República Argentina.</p>

                <p className="text-xs italic mt-4 text-muted-foreground">El texto completo del consentimiento está disponible en formato PDF al descargarlo después de firmar.</p>
              </ScrollArea>

              <div className="flex items-start gap-3 rounded-md border p-3" style={{ borderColor: "#E2DED8", background: "#F8F7F4" }}>
                <Checkbox
                  id="accept"
                  checked={form.accepted}
                  onCheckedChange={(c) => setForm({ ...form, accepted: c === true })}
                />
                <label htmlFor="accept" className="text-sm leading-relaxed cursor-pointer" style={{ color: "#1A1A1A" }}>
                  Declaro haber leído, comprendido y aceptado en su totalidad el Consentimiento Informado Profesional de la plataforma .PSI. y manifiesto conocer mis derechos y obligaciones.
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sigName">Firma — Nombre completo *</Label>
                  <Input
                    id="sigName"
                    value={form.signatureName}
                    onChange={(e) => setForm({ ...form, signatureName: e.target.value })}
                    placeholder="Tipeá tu nombre completo"
                    style={{ fontFamily: "'Brush Script MT', cursive", fontSize: "1.1rem" }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Debe coincidir exactamente con el nombre declarado.</p>
                </div>
                <div>
                  <Label htmlFor="sigDni">Firma — DNI *</Label>
                  <Input
                    id="sigDni"
                    value={form.signatureDni}
                    onChange={(e) => setForm({ ...form, signatureDni: e.target.value })}
                    placeholder="DNI tipeado"
                  />
                </div>
              </div>

              <div className="rounded-md p-3 text-xs flex items-start gap-2" style={{ background: "#EEF3FA", color: "#1C3F6E" }}>
                <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  Tu firma quedará registrada en un PDF firmado, almacenado de forma cifrada y solo accesible por vos y el administrador (Lic. Esp. Germán H. Nieves) para registro interno.
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  ← Volver a datos
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !form.accepted}
                  className="flex-1"
                  style={{ background: "#1C3F6E", color: "#fff", borderRadius: "6px" }}
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Firmar y enviar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfessionalRegistration;
