import { supabase } from '@/integrations/supabase/client';

const ensure = <T>(data: T | null, e: string): T => {
  if (!data) throw new Error(`Nenhum registro de ${e} retornado.`);
  return data;
};

export const historicoContratoService = {
  async listar(colaboradorId: string) {
    const { data, error } = await supabase
      .from('historico_contratos')
      .select('*')
      .eq('colaborador_id', colaboradorId)
      .order('data_inicio', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async criar(d: any) {
    const { data, error } = await supabase.from('historico_contratos').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'histórico de contrato');
  },
  async excluir(id: string) {
    const { error } = await supabase.from('historico_contratos').delete().eq('id', id);
    if (error) throw error;
  },
};
