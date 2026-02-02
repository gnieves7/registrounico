import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesUpdate } from "@/integrations/supabase/types";

export type Psychobiography = Tables<"psychobiographies">;
export type PsychobiographyUpdate = TablesUpdate<"psychobiographies">;

export interface FamilyData {
  parents?: {
    father?: { name?: string; age?: number; occupation?: string; relationship?: string; alive?: boolean };
    mother?: { name?: string; age?: number; occupation?: string; relationship?: string; alive?: boolean };
  };
  siblings?: Array<{ name?: string; age?: number; relationship?: string }>;
  children?: Array<{ name?: string; age?: number }>;
  familyDynamics?: string;
  significantRelationships?: string;
}

export interface MedicalHistory {
  currentConditions?: string[];
  pastConditions?: string[];
  medications?: Array<{ name?: string; dose?: string; frequency?: string }>;
  allergies?: string[];
  surgeries?: string[];
  familyMedicalHistory?: string;
}

export interface PsychologicalHistory {
  previousTherapy?: boolean;
  therapyDetails?: string;
  diagnoses?: string[];
  hospitalizations?: string[];
  currentSymptoms?: string;
  copingMechanisms?: string;
}

export interface SocialData {
  socialNetwork?: string;
  friendships?: string;
  communityInvolvement?: string;
  hobbies?: string[];
  spirituality?: string;
}

export interface WorkHistory {
  currentJob?: { title?: string; company?: string; duration?: string; satisfaction?: string };
  previousJobs?: Array<{ title?: string; company?: string; duration?: string; reason_left?: string }>;
  careerGoals?: string;
  workChallenges?: string;
}

export interface LifestyleData {
  sleepPattern?: string;
  exercise?: string;
  diet?: string;
  substanceUse?: { alcohol?: string; tobacco?: string; drugs?: string; caffeine?: string };
  stressLevel?: string;
  relaxationMethods?: string[];
}

export interface TraumaticEvent {
  description?: string;
  age?: number;
  impact?: string;
  resolved?: boolean;
}

export interface LegalHistory {
  hasLegalIssues?: boolean;
  details?: string;
  currentStatus?: string;
}

export interface PersonalValues {
  coreValues?: string[];
  lifeGoals?: string;
  fears?: string[];
  strengths?: string[];
  areasToImprove?: string[];
  motivations?: string;
}

export function usePsychobiography() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<Psychobiography | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPsychobiography = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data: psycho, error } = await supabase
        .from("psychobiographies")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setData(psycho);
    } catch (error) {
      console.error("Error fetching psychobiography:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar tu psicobiografía",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchPsychobiography();
  }, [fetchPsychobiography]);

  const updateSection = useCallback(
    async (updates: PsychobiographyUpdate) => {
      if (!user || !data) return false;

      try {
        setIsSaving(true);
        const { error } = await supabase
          .from("psychobiographies")
          .update(updates)
          .eq("user_id", user.id);

        if (error) throw error;

        setData((prev) => (prev ? { ...prev, ...updates } : prev));
        toast({
          title: "Guardado",
          description: "Los cambios se han guardado correctamente",
        });
        return true;
      } catch (error) {
        console.error("Error updating psychobiography:", error);
        toast({
          title: "Error",
          description: "No se pudieron guardar los cambios",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [user, data, toast]
  );

  const calculateProgress = useCallback(() => {
    if (!data) return 0;

    const sections = [
      // Personal data
      !!(data.birth_date || data.birth_place || data.nationality || data.address || data.education_level || data.occupation || data.marital_status),
      // Family
      !!(data.family_data && Object.keys(data.family_data as object).length > 0),
      // Medical
      !!(data.medical_history && Object.keys(data.medical_history as object).length > 0),
      // Psychological
      !!(data.psychological_history && Object.keys(data.psychological_history as object).length > 0),
      // Social/Work
      !!(data.social_data && Object.keys(data.social_data as object).length > 0) ||
        !!(data.work_history && (data.work_history as unknown[]).length > 0),
      // Lifestyle
      !!(data.lifestyle_data && Object.keys(data.lifestyle_data as object).length > 0),
      // Significant events
      !!(data.traumatic_events && (data.traumatic_events as unknown[]).length > 0) ||
        !!(data.legal_history && Object.keys(data.legal_history as object).length > 0) ||
        !!(data.personal_values && Object.keys(data.personal_values as object).length > 0),
    ];

    const completed = sections.filter(Boolean).length;
    return Math.round((completed / sections.length) * 100);
  }, [data]);

  return {
    data,
    isLoading,
    isSaving,
    updateSection,
    calculateProgress,
    refetch: fetchPsychobiography,
  };
}
