import { supabase } from '@/integrations/supabase/client';

const ensure = <T>(data: T | null, e: string): T => {
  if (!data) throw new Error(`Nenhum registro de ${e} retornado.`);
  return data;
};

export const localTrabalhoService = {
  async listar(empresaId?: string) {
    let query = supabase.from('locais_trabalho').select('*').order('nome');
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  async criar(d: any) {
    const { data, error } = await supabase.from('locais_trabalho').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'local de trabalho');
  },
  async atualizar(id: string, d: any) {
    const { data, error } = await supabase.from('locais_trabalho').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'local de trabalho');
  },
  async excluir(id: string) {
    const { error } = await supabase.from('locais_trabalho').delete().eq('id', id);
    if (error) throw error;
  },
};
