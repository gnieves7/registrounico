import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

// Types
export interface MbtiTest {
  id: string;
  user_id: string;
  test_date: string;
  responses: number[];
  extraversion_score: number;
  introversion_score: number;
  sensing_score: number;
  intuition_score: number;
  thinking_score: number;
  feeling_score: number;
  judging_score: number;
  perceiving_score: number;
  personality_type: string | null;
  is_complete: boolean;
  clinical_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Mmpi2Test {
  id: string;
  user_id: string;
  test_date: string;
  responses: { question_number: number; answer: 'V' | 'F' }[];
  total_questions_answered: number;
  is_complete: boolean;
  clinical_notes: string | null;
  clinical_interpretation: string | null;
  interpretation_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface ForensicCase {
  id: string;
  user_id: string;
  case_number: string | null;
  court_name: string | null;
  intervening_actors: { name: string; role: string }[];
  defense_lawyer_name: string | null;
  defense_lawyer_phone: string | null;
  defense_lawyer_email: string | null;
  hearing_date: string | null;
  next_hearing_date: string | null;
  reported_fact: string | null;
  complaint_date: string | null;
  complainant_name: string | null;
  complainant_relationship: string | null;
  additional_info: string | null;
  case_status: string;
  confidentiality_notice: string;
  created_at: string;
  updated_at: string;
}

export interface ForensicDocument {
  id: string;
  case_id: string;
  user_id: string;
  document_name: string;
  document_type: string | null;
  file_url: string | null;
  description: string | null;
  upload_date: string;
  created_at: string;
}

export const usePsychodiagnostic = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ==================== MBTI ====================
  const mbtiQuery = useQuery({
    queryKey: ["mbti-tests", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("mbti_tests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map(test => ({
        ...test,
        responses: (test.responses as Json) as number[]
      })) as MbtiTest[];
    },
    enabled: !!user?.id,
  });

  const createMbtiTest = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("No user");
      const { data, error } = await supabase
        .from("mbti_tests")
        .insert({ user_id: user.id, responses: [] })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mbti-tests"] });
      toast({ title: "Test MBTI iniciado" });
    },
  });

  const updateMbtiTest = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MbtiTest> & { id: string }) => {
      const { data, error } = await supabase
        .from("mbti_tests")
        .update(updates as Record<string, unknown>)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mbti-tests"] });
    },
  });

  // ==================== MMPI-2 ====================
  const mmpi2Query = useQuery({
    queryKey: ["mmpi2-tests", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("mmpi2_tests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map(test => ({
        ...test,
        responses: (test.responses as Json) as { question_number: number; answer: 'V' | 'F' }[]
      })) as Mmpi2Test[];
    },
    enabled: !!user?.id,
  });

  const createMmpi2Test = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("No user");
      const { data, error } = await supabase
        .from("mmpi2_tests")
        .insert({ user_id: user.id, responses: [] })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mmpi2-tests"] });
      toast({ title: "Test MMPI-2 iniciado" });
    },
  });

  const updateMmpi2Test = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Mmpi2Test> & { id: string }) => {
      const { data, error } = await supabase
        .from("mmpi2_tests")
        .update(updates as Record<string, unknown>)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mmpi2-tests"] });
    },
  });

  // ==================== FORENSIC CASES ====================
  const forensicCasesQuery = useQuery({
    queryKey: ["forensic-cases", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("forensic_cases")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map(c => ({
        ...c,
        intervening_actors: (c.intervening_actors as Json) as { name: string; role: string }[]
      })) as ForensicCase[];
    },
    enabled: !!user?.id,
  });

  const createForensicCase = useMutation({
    mutationFn: async (caseData: Partial<ForensicCase>) => {
      if (!user?.id) throw new Error("No user");
      
      // Build insert object with proper types
      const insertData = {
        user_id: user.id,
        case_number: caseData.case_number || null,
        court_name: caseData.court_name || null,
        intervening_actors: caseData.intervening_actors || [],
        defense_lawyer_name: caseData.defense_lawyer_name || null,
        defense_lawyer_phone: caseData.defense_lawyer_phone || null,
        defense_lawyer_email: caseData.defense_lawyer_email || null,
        hearing_date: caseData.hearing_date || null,
        next_hearing_date: caseData.next_hearing_date || null,
        reported_fact: caseData.reported_fact || null,
        complaint_date: caseData.complaint_date || null,
        complainant_name: caseData.complainant_name || null,
        complainant_relationship: caseData.complainant_relationship || null,
        additional_info: caseData.additional_info || null,
        case_status: caseData.case_status || 'activo',
      };
      
      const { data, error } = await supabase
        .from("forensic_cases")
        .insert(insertData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forensic-cases"] });
      toast({ title: "Caso forense creado" });
    },
  });

  const updateForensicCase = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ForensicCase> & { id: string }) => {
      const { data, error } = await supabase
        .from("forensic_cases")
        .update(updates as Record<string, unknown>)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forensic-cases"] });
      toast({ title: "Caso actualizado" });
    },
  });

  const deleteForensicCase = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("forensic_cases")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forensic-cases"] });
      toast({ title: "Caso eliminado" });
    },
  });

  // ==================== FORENSIC DOCUMENTS ====================
  const getForensicDocuments = (caseId: string) => {
    return useQuery({
      queryKey: ["forensic-documents", caseId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("forensic_documents")
          .select("*")
          .eq("case_id", caseId)
          .order("upload_date", { ascending: false });
        if (error) throw error;
        return data as ForensicDocument[];
      },
      enabled: !!caseId,
    });
  };

  const uploadForensicDocument = useMutation({
    mutationFn: async ({ caseId, file, documentType, description }: {
      caseId: string;
      file: File;
      documentType: string;
      description?: string;
    }) => {
      if (!user?.id) throw new Error("No user");
      
      // Upload file to storage
      const filePath = `${user.id}/${caseId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("forensic-documents")
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("forensic-documents")
        .getPublicUrl(filePath);

      // Create document record
      const { data, error } = await supabase
        .from("forensic_documents")
        .insert({
          case_id: caseId,
          user_id: user.id,
          document_name: file.name,
          document_type: documentType,
          file_url: urlData.publicUrl,
          description,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["forensic-documents", variables.caseId] });
      toast({ title: "Documento subido correctamente" });
    },
  });

  const deleteForensicDocument = useMutation({
    mutationFn: async ({ id, caseId }: { id: string; caseId: string }) => {
      const { error } = await supabase
        .from("forensic_documents")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["forensic-documents", variables.caseId] });
      toast({ title: "Documento eliminado" });
    },
  });

  return {
    // MBTI
    mbtiTests: mbtiQuery.data || [],
    mbtiLoading: mbtiQuery.isLoading,
    createMbtiTest,
    updateMbtiTest,
    refetchMbti: mbtiQuery.refetch,
    
    // MMPI-2
    mmpi2Tests: mmpi2Query.data || [],
    mmpi2Loading: mmpi2Query.isLoading,
    createMmpi2Test,
    updateMmpi2Test,
    refetchMmpi2: mmpi2Query.refetch,
    
    // Forensic Cases
    forensicCases: forensicCasesQuery.data || [],
    forensicCasesLoading: forensicCasesQuery.isLoading,
    createForensicCase,
    updateForensicCase,
    deleteForensicCase,
    
    // Forensic Documents
    getForensicDocuments,
    uploadForensicDocument,
    deleteForensicDocument,
  };
};
