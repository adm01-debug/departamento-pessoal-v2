import { supabase } from '@/integrations/supabase/client';
import { Result, Ok, Err, toResult } from '@/types/result';

export const historicoContratoService = {
  async listar(colaboradorId: string): Promise<Result<any[]>> {
    return toResult((async () => {
      const { data, error } = await supabase
        .from('historico_contratos')
        .select('*')
        .eq('colaborador_id', colaboradorId)
        .order('data_inicio', { ascending: false });
      if (error) throw error;
      return data || [];
    })());
  },
  
  async criar(d: any): Promise<Result<any>> {
    return toResult((async () => {
      const { data, error } = await supabase.from('historico_contratos').insert(d).select().maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Nenhum registro de histórico de contrato foi retornado.');
      return data;
    })());
  },
  
  async excluir(id: string): Promise<Result<void>> {
    return toResult((async () => {
      const { error } = await supabase.from('historico_contratos').delete().eq('id', id);
      if (error) throw error;
    })());
  },
};

