import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProfileItem {
  id: string;
  item_type: string;
  title: string;
  subtitle: string | null;
  institution: string | null;
  description: string | null;
  features: string[];
  icon_name: string | null;
  is_popular: boolean;
  sort_order: number;
}

export interface ProfileContent {
  biography: { paragraphs: string[] };
  expertise: { items: string[] };
  affiliations: { items: string[] };
}

const defaultContent: ProfileContent = {
  biography: { paragraphs: [] },
  expertise: { items: [] },
  affiliations: { items: [] },
};

export const useProfessionalProfile = () => {
  const [education, setEducation] = useState<ProfileItem[]>([]);
  const [services, setServices] = useState<ProfileItem[]>([]);
  const [content, setContent] = useState<ProfileContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from("professional_profile_items")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data) {
      const items = data.map((d: any) => ({
        ...d,
        features: Array.isArray(d.features) ? d.features : [],
        is_popular: d.is_popular || false,
      })) as ProfileItem[];
      setEducation(items.filter(i => i.item_type === "education"));
      setServices(items.filter(i => i.item_type === "service"));
    }
  }, []);

  const fetchContent = useCallback(async () => {
    const { data, error } = await supabase
      .from("professional_profile_content")
      .select("section_key, content");

    if (!error && data) {
      const mapped: any = { ...defaultContent };
      data.forEach((row: any) => {
        if (row.section_key in mapped) {
          mapped[row.section_key] = row.content;
        }
      });
      setContent(mapped);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchItems(), fetchContent()]).then(() => setLoading(false));
  }, [fetchItems, fetchContent]);

  const saveItem = async (item: Partial<ProfileItem>, itemType: string, listLength: number) => {
    if (item.id) {
      const { id, item_type: _it, ...rest } = item as any;
      const { error } = await supabase.from("professional_profile_items").update(rest).eq("id", id);
      if (error) { toast.error("Error al actualizar"); return false; }
      toast.success("Actualizado");
    } else {
      const insertData = { ...item, item_type: itemType, sort_order: listLength + 1 } as any;
      const { error } = await supabase.from("professional_profile_items").insert(insertData);
      if (error) { toast.error("Error al agregar"); return false; }
      toast.success("Agregado");
    }
    await fetchItems();
    return true;
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("professional_profile_items").delete().eq("id", id);
    if (error) { toast.error("Error al eliminar"); return; }
    toast.success("Eliminado");
    await fetchItems();
  };

  const reorderItems = async (items: ProfileItem[]) => {
    const updates = items.map((item, index) =>
      supabase.from("professional_profile_items").update({ sort_order: index + 1 }).eq("id", item.id)
    );
    await Promise.all(updates);
  };

  const saveContent = async (sectionKey: string, newContent: any) => {
    const { error } = await supabase
      .from("professional_profile_content")
      .update({ content: newContent, updated_at: new Date().toISOString() })
      .eq("section_key", sectionKey);
    if (error) { toast.error("Error al guardar"); return false; }
    toast.success("Sección actualizada");
    await fetchContent();
    return true;
  };

  return {
    education, services, content, loading,
    setEducation, setServices,
    saveItem, deleteItem, reorderItems, saveContent,
    fetchItems,
  };
};
