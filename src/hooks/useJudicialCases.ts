import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type JudicialJurisdiction = "civil" | "penal" | "familia" | "laboral";
export type JudicialStatus = "activo" | "archivado" | "sentencia" | "apelacion";
export type AttachmentType =
  | "informe_pericial"
  | "gesell"
  | "sentencia"
  | "fundamentos"
  | "denuncia"
  | "otro";

export interface JudicialCase {
  id: string;
  owner_user_id: string;
  case_title: string;
  cuij: string | null;
  legajo_number: string | null;
  jurisdiction: JudicialJurisdiction;
  court_name: string | null;
  court_division: string | null;
  case_status: JudicialStatus;
  complainant_name: string | null;
  complainant_dni: string | null;
  complainant_relationship: string | null;
  complaint_date: string | null;
  complaint_place: string | null;
  reported_facts: string | null;
  defense_lawyer_name: string | null;
  defense_lawyer_matricula: string | null;
  defense_lawyer_phone: string | null;
  defense_lawyer_email: string | null;
  prosecutor_name: string | null;
  gesell_chamber_date: string | null;
  gesell_chamber_notes: string | null;
  next_hearing_date: string | null;
  sentence_date: string | null;
  sentence_summary: string | null;
  confidentiality_notice: string | null;
  additional_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface JudicialAttachment {
  id: string;
  case_id: string;
  uploaded_by: string;
  attachment_type: AttachmentType;
  title: string;
  description: string | null;
  storage_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
}

const BUCKET = "expedientes-judiciales";

export function useJudicialCases() {
  const { user } = useAuth();
  const [cases, setCases] = useState<JudicialCase[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("judicial_cases")
      .select("*")
      .order("updated_at", { ascending: false });
    if (!error && data) setCases(data as JudicialCase[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const createCase = useCallback(
    async (payload: Partial<JudicialCase>) => {
      if (!user) throw new Error("No autenticado");
      const { data, error } = await supabase
        .from("judicial_cases")
        .insert({
          owner_user_id: user.id,
          case_title: payload.case_title || "Nuevo expediente",
          jurisdiction: (payload.jurisdiction as string) || "penal",
          ...payload,
        } as never)
        .select()
        .single();
      if (error) throw error;
      await fetchCases();
      return data as JudicialCase;
    },
    [user, fetchCases]
  );

  const updateCase = useCallback(
    async (id: string, patch: Partial<JudicialCase>) => {
      const { error } = await supabase
        .from("judicial_cases")
        .update(patch as never)
        .eq("id", id);
      if (error) throw error;
      await fetchCases();
    },
    [fetchCases]
  );

  const deleteCase = useCallback(
    async (id: string) => {
      // Borrar archivos del bucket primero
      const { data: list } = await supabase.storage.from(BUCKET).list(id);
      if (list && list.length) {
        await supabase.storage
          .from(BUCKET)
          .remove(list.map((o) => `${id}/${o.name}`));
      }
      const { error } = await supabase.from("judicial_cases").delete().eq("id", id);
      if (error) throw error;
      await fetchCases();
    },
    [fetchCases]
  );

  return { cases, loading, fetchCases, createCase, updateCase, deleteCase };
}

export function useJudicialAttachments(caseId: string | null) {
  const { user } = useAuth();
  const [attachments, setAttachments] = useState<JudicialAttachment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAttachments = useCallback(async () => {
    if (!caseId) {
      setAttachments([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("judicial_case_attachments")
      .select("*")
      .eq("case_id", caseId)
      .order("created_at", { ascending: false });
    if (!error && data) setAttachments(data as JudicialAttachment[]);
    setLoading(false);
  }, [caseId]);

  useEffect(() => {
    fetchAttachments();
  }, [fetchAttachments]);

  const uploadAttachment = useCallback(
    async (
      file: File,
      meta: { attachment_type: AttachmentType; title: string; description?: string }
    ) => {
      if (!caseId || !user) throw new Error("Caso o usuario inválido");
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${caseId}/${Date.now()}_${safeName}`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      const { error: dbErr } = await supabase
        .from("judicial_case_attachments")
        .insert({
          case_id: caseId,
          uploaded_by: user.id,
          attachment_type: meta.attachment_type,
          title: meta.title,
          description: meta.description ?? null,
          storage_path: path,
          mime_type: file.type,
          size_bytes: file.size,
        } as never);
      if (dbErr) {
        await supabase.storage.from(BUCKET).remove([path]);
        throw dbErr;
      }
      await fetchAttachments();
    },
    [caseId, user, fetchAttachments]
  );

  const getSignedUrl = useCallback(async (path: string) => {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 60 * 10);
    if (error) throw error;
    return data.signedUrl;
  }, []);

  const deleteAttachment = useCallback(
    async (att: JudicialAttachment) => {
      await supabase.storage.from(BUCKET).remove([att.storage_path]);
      const { error } = await supabase
        .from("judicial_case_attachments")
        .delete()
        .eq("id", att.id);
      if (error) throw error;
      await fetchAttachments();
    },
    [fetchAttachments]
  );

  return {
    attachments,
    loading,
    fetchAttachments,
    uploadAttachment,
    getSignedUrl,
    deleteAttachment,
  };
}
