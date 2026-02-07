import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface DreamRecord {
  id: string;
  user_id: string;
  dream_date: string;
  title: string | null;
  dream_content: string;
  dream_emojis: string[];
  interpretation: string | null;
  interpretation_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface DreamRecordInsert {
  title?: string;
  dream_date: string;
  dream_content: string;
  dream_emojis: string[];
}

export const useDreamRecords = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dreams, setDreams] = useState<DreamRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchDreams = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("dream_records")
        .select("*")
        .eq("user_id", user.id)
        .order("dream_date", { ascending: false });

      if (error) throw error;

      const formattedDreams: DreamRecord[] = (data || []).map((d) => ({
        ...d,
        dream_emojis: Array.isArray(d.dream_emojis) 
          ? (d.dream_emojis as unknown as string[]) 
          : [],
      }));

      setDreams(formattedDreams);
    } catch (error) {
      console.error("Error fetching dreams:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los sueños",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveDream = async (dream: DreamRecordInsert) => {
    if (!user) return null;

    try {
      setIsSaving(true);
      const { data, error } = await supabase
        .from("dream_records")
        .insert({
          user_id: user.id,
          title: dream.title || null,
          dream_date: dream.dream_date,
          dream_content: dream.dream_content,
          dream_emojis: dream.dream_emojis,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sueño registrado",
        description: "Tu sueño ha sido guardado exitosamente",
      });

      await fetchDreams();
      return data;
    } catch (error) {
      console.error("Error saving dream:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el sueño",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const updateInterpretation = async (dreamId: string, interpretation: string) => {
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from("dream_records")
        .update({
          interpretation,
          interpretation_date: new Date().toISOString(),
        })
        .eq("id", dreamId);

      if (error) throw error;

      toast({
        title: "Interpretación guardada",
        description: "La interpretación ha sido guardada",
      });

      await fetchDreams();
    } catch (error) {
      console.error("Error updating interpretation:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la interpretación",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteDream = async (dreamId: string) => {
    try {
      const { error } = await supabase
        .from("dream_records")
        .delete()
        .eq("id", dreamId);

      if (error) throw error;

      toast({
        title: "Sueño eliminado",
        description: "El registro ha sido eliminado",
      });

      await fetchDreams();
    } catch (error) {
      console.error("Error deleting dream:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el sueño",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDreams();
  }, [user]);

  return {
    dreams,
    isLoading,
    isSaving,
    saveDream,
    updateInterpretation,
    deleteDream,
    refetch: fetchDreams,
  };
};
