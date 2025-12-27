import { supabase } from '@/integrations/supabase/client';

export const desligamentoService = {
  async getAll() {
    const { data, error } = await supabase.from('desligamento').select('*');
    if (error) throw error;
    return data || [];
  },
  async getById(id: string) {
    const { data, error } = await supabase.from('desligamento').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(item: any) {
    const { data, error } = await supabase.from('desligamento').insert(item).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, item: any) {
    const { data, error } = await supabase.from('desligamento').update(item).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string) {
    const { error } = await supabase.from('desligamento').delete().eq('id', id);
    if (error) throw error;
  },
};
export default desligamentoService;
