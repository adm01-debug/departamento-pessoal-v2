import { supabase } from '@/integrations/supabase/client';

export const desligamentoService = {
  async listar(empresaId?: string) {
    let query = supabase.from('desligamentos').select('*, colaborador:colaboradores(nome_completo)').order('data_desligamento', { ascending: false });
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  async buscarPorId(id: string) {
    const { data, error } = await supabase.from('desligamentos').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },
  async criar(d: any) {
    const { data, error } = await supabase.from('desligamentos').insert(d).select().maybeSingle();
    if (error) throw error;
    return data;
  },
  async atualizar(id: string, d: any) {
    const { data, error } = await supabase.from('desligamentos').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return data;
  },
  async excluir(id: string) {
    const { error } = await supabase.from('desligamentos').delete().eq('id', id);
    if (error) throw error;
  },
};
