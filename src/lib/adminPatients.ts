import { supabase } from '@/integrations/supabase/client';

export interface PatientLite {
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  is_approved: boolean;
  created_at: string;
}

export async function listPatients(): Promise<PatientLite[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('user_id, full_name, email, avatar_url, is_approved, created_at, account_type')
    .neq('account_type', 'professional')
    .order('full_name', { ascending: true });
  if (error) throw error;
  return ((data || []) as any[]).map((p) => ({
    user_id: p.user_id,
    full_name: p.full_name,
    email: p.email,
    avatar_url: p.avatar_url,
    is_approved: !!p.is_approved,
    created_at: p.created_at,
  }));
}
