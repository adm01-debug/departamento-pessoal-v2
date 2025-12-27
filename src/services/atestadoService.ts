import { supabase } from '@/integrations/supabase/client';

export const atestadoService = {
  async getAll() {
    const { data, error } = await supabase.from('atestado').select('*');
    if (error) throw error;
    return data || [];
  },
  async getById(id: string) {
    const { data, error } = await supabase.from('atestado').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(item: any) {
    const { data, error } = await supabase.from('atestado').insert(item).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, item: any) {
    const { data, error } = await supabase.from('atestado').update(item).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string) {
    const { error } = await supabase.from('atestado').delete().eq('id', id);
    if (error) throw error;
  },
};
export default atestadoService;
