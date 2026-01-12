// V17.2-S109: StorageService Real
import { supabase } from '@/integrations/supabase/client';
export const storageServiceReal = {
  async upload(bucket: string, path: string, file: File) { const { error } = await supabase.storage.from(bucket).upload(path, file); if (error) throw error; const { data } = supabase.storage.from(bucket).getPublicUrl(path); return data.publicUrl; },
  async download(bucket: string, path: string) { const { data, error } = await supabase.storage.from(bucket).download(path); if (error) throw error; return data; },
  async delete(bucket: string, path: string) { await supabase.storage.from(bucket).remove([path]); },
  async list(bucket: string, folder?: string) { const { data } = await supabase.storage.from(bucket).list(folder); return data || []; }
}; export default storageServiceReal;
