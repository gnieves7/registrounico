import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  PageOrientation,
  BorderStyle,
} from "docx";
import type { ConsentModelMeta } from "./consentTemplates";

export interface ProfessionalData {
  fullName: string;
  matriculaNacional?: string;
  matriculaProvincial?: string;
  specialty?: string;
  address?: string;
  phone?: string;
  email?: string;
  honorarios?: string;
}

export interface PatientData {
  fullName: string;
  dni: string;
  birthDate?: string;
  address?: string;
}

const dash = (v?: string) => (v && v.trim().length ? v.trim() : "__________");

function headerBlock(model: ConsentModelMeta, prof: ProfessionalData): Paragraph[] {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.TITLE,
      children: [new TextRun({ text: "CONSENTIMIENTO INFORMADO", bold: true, size: 32 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [new TextRun({ text: model.title, italics: true, size: 24 })],
    }),
    new Paragraph({
      spacing: { after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "8B0000", space: 4 } },
      children: [new TextRun({ text: "Datos del/la profesional", bold: true, size: 24 })],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: "Nombre y apellido: ", bold: true }),
        new TextRun(dash(prof.fullName)),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: "Matrícula Nacional Nº: ", bold: true }),
        new TextRun(dash(prof.matriculaNacional)),
        new TextRun({ text: "    Matrícula Provincial Nº: ", bold: true }),
        new TextRun(dash(prof.matriculaProvincial)),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: "Especialidad: ", bold: true }),
        new TextRun(dash(prof.specialty)),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: "Domicilio profesional: ", bold: true }),
        new TextRun(dash(prof.address)),
      ],
    }),
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({ text: "Teléfono: ", bold: true }),
        new TextRun(dash(prof.phone)),
        new TextRun({ text: "    Correo: ", bold: true }),
        new TextRun(dash(prof.email)),
      ],
    }),
  ];
}

function patientBlock(patient?: PatientData): Paragraph[] {
  return [
    new Paragraph({
      spacing: { after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "8B0000", space: 4 } },
      children: [new TextRun({ text: "Datos del/la consultante", bold: true, size: 24 })],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: "Nombre y apellido: ", bold: true }),
        new TextRun(dash(patient?.fullName)),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: "DNI: ", bold: true }),
        new TextRun(dash(patient?.dni)),
        new TextRun({ text: "    Fecha de nacimiento: ", bold: true }),
        new TextRun(dash(patient?.birthDate)),
      ],
    }),
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({ text: "Domicilio: ", bold: true }),
        new TextRun(dash(patient?.address)),
      ],
    }),
  ];
}

function bodySections(model: ConsentModelMeta, prof: ProfessionalData): Paragraph[] {
  const out: Paragraph[] = [];
  for (const sec of model.sections) {
    out.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        children: [new TextRun({ text: sec.heading, bold: true, size: 26 })],
      }),
    );
    let body = sec.body;
    if (prof.honorarios) {
      body = body.replace(/\$__________/g, `$${prof.honorarios}`);
    }
    out.push(
      new Paragraph({
        spacing: { after: 120, line: 360 },
        alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: body, size: 22 })],
      }),
    );
  }
  return out;
}

function legalFooter(model: ConsentModelMeta): Paragraph[] {
  const items: Paragraph[] = [
    new Paragraph({
      spacing: { before: 360, after: 120 },
      children: [new TextRun({ text: "Marco normativo aplicable", bold: true, size: 22 })],
    }),
  ];
  for (const law of model.legalFrame) {
    items.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({ text: `• ${law}`, size: 20 })],
      }),
    );
  }
  return items;
}

function signatureBlock(prof: ProfessionalData): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 720, after: 120 },
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "_______________________________", size: 22 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({ text: dash(prof.fullName), bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
      children: [
        new TextRun({
          text: `M.N. ${dash(prof.matriculaNacional)} · M.P. ${dash(prof.matriculaProvincial)}`,
          size: 20,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 240, after: 120 },
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "_______________________________", size: 22 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "Firma y aclaración del/la consultante", size: 20 }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [new TextRun({ text: "DNI: __________", size: 20 })],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 480 },
      children: [
        new TextRun({
          text: `Lugar y fecha: __________________________________`,
          size: 20,
          italics: true,
        }),
      ],
    }),
  ];
}

export async function buildConsentDocxBlob(
  model: ConsentModelMeta,
  prof: ProfessionalData,
  patient?: PatientData,
): Promise<Blob> {
  const doc = new Document({
    creator: prof.fullName || ".PSI.",
    title: model.title,
    description: `Consentimiento informado generado desde .PSI. — ${model.code}`,
    styles: {
      default: { document: { run: { font: "Calibri", size: 22 } } },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906,
              height: 16838,
              orientation: PageOrientation.PORTRAIT,
            },
            margin: { top: 1134, right: 1134, bottom: 1134, left: 1701 },
          },
        },
        children: [
          ...headerBlock(model, prof),
          ...patientBlock(patient),
          ...bodySections(model, prof),
          ...legalFooter(model),
          ...signatureBlock(prof),
        ],
      },
    ],
  });

  return Packer.toBlob(doc);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
