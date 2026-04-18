import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ResourceSection } from '@/data/professionalResourcesContent';

export interface ProfessionalResource {
  id: string;
  section: ResourceSection;
  title: string;
  description: string | null;
  resource_type: 'pdf' | 'link' | 'template';
  url: string | null;
  storage_path: string | null;
  author: string | null;
  source: string | null;
  role_tag: 'clinical' | 'forensic' | 'both' | 'institutional';
  sort_order: number;
}

export function useProfessionalResources() {
  const [resources, setResources] = useState<ProfessionalResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from('professional_resources')
        .select('*')
        .order('section', { ascending: true })
        .order('sort_order', { ascending: true });
      if (!mounted) return;
      if (error) setError(error.message);
      else setResources((data as ProfessionalResource[]) ?? []);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  /** Returns a short-lived signed URL for a PDF stored in the private bucket. */
  const getSignedUrl = useCallback(async (storagePath: string) => {
    const { data, error } = await supabase.storage
      .from('recursos-profesionales')
      .createSignedUrl(storagePath, 60 * 10); // 10 min
    if (error) throw error;
    return data.signedUrl;
  }, []);

  const logDownload = useCallback(async (resourceId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('resource_downloads').insert({
      resource_id: resourceId,
      user_id: user.id,
    });
  }, []);

  return { resources, loading, error, getSignedUrl, logDownload };
}
