import { supabase } from '@/integrations/supabase/client';

const ensureSingleResult = <T>(data: T | null, entity: string): T => {
  if (!data) throw new Error(`Nenhum registro de ${entity} foi retornado.`);
  return data;
};

export const cargoService = {
  async listar(empresaId?: string) {
    let query = supabase.from('cargos').select('*').order('nome');
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  async buscarPorId(id: string) {
    const { data, error } = await supabase.from('cargos').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },
  async criar(d: any) {
    const { data, error } = await supabase.from('cargos').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensureSingleResult(data, 'cargo');
  },
  async atualizar(id: string, d: any) {
    const { data, error } = await supabase.from('cargos').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensureSingleResult(data, 'cargo');
  },
  async excluir(id: string) {
    const { error } = await supabase.from('cargos').delete().eq('id', id);
    if (error) throw error;
  },
};
