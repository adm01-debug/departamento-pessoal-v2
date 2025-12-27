import { supabase } from '@/integrations/supabase/client';

export const rescisaoService = {
  async getAll() {
    const { data, error } = await supabase.from('rescisao').select('*');
    if (error) throw error;
    return data || [];
  },
  async getById(id: string) {
    const { data, error } = await supabase.from('rescisao').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(item: any) {
    const { data, error } = await supabase.from('rescisao').insert(item).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, item: any) {
    const { data, error } = await supabase.from('rescisao').update(item).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string) {
    const { error } = await supabase.from('rescisao').delete().eq('id', id);
    if (error) throw error;
  },
};
export default rescisaoService;
