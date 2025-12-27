import { supabase } from '@/integrations/supabase/client';

export const promocaoService = {
  async getAll() {
    const { data, error } = await supabase.from('promocao').select('*');
    if (error) throw error;
    return data || [];
  },
  async getById(id: string) {
    const { data, error } = await supabase.from('promocao').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(item: any) {
    const { data, error } = await supabase.from('promocao').insert(item).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, item: any) {
    const { data, error } = await supabase.from('promocao').update(item).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string) {
    const { error } = await supabase.from('promocao').delete().eq('id', id);
    if (error) throw error;
  },
};
export default promocaoService;
