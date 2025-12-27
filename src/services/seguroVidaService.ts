import { supabase } from '@/integrations/supabase/client';

export const seguroVidaService = {
  async getAll() {
    const { data, error } = await supabase.from('seguroVida').select('*');
    if (error) throw error;
    return data || [];
  },
  async getById(id: string) {
    const { data, error } = await supabase.from('seguroVida').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(item: any) {
    const { data, error } = await supabase.from('seguroVida').insert(item).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, item: any) {
    const { data, error } = await supabase.from('seguroVida').update(item).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string) {
    const { error } = await supabase.from('seguroVida').delete().eq('id', id);
    if (error) throw error;
  },
};
export default seguroVidaService;
