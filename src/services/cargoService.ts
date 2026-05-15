import { supabase } from '@/integrations/supabase/client';
import { Result, Ok, Err, toResult } from '@/types/result';

export const cargoService = {
  async listar(empresaId?: string): Promise<Result<any[]>> {
    return toResult((async () => {
      let query = supabase.from('cargos').select('*').order('nome');
      if (empresaId) query = query.eq('empresa_id', empresaId);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    })());
  },
  
  async buscarPorId(id: string): Promise<Result<any | null>> {
    return toResult((async () => {
      const { data, error } = await supabase.from('cargos').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data;
    })());
  },
  
  async criar(d: any): Promise<Result<any>> {
    return toResult((async () => {
      const { data, error } = await supabase.from('cargos').insert(d).select().maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Nenhum registro de cargo foi retornado.');
      return data;
    })());
  },
  
  async atualizar(id: string, d: any): Promise<Result<any>> {
    return toResult((async () => {
      const { data: current, error: currentError } = await supabase.from('cargos').select('version').eq('id', id).single();
      if (currentError) throw currentError;
      
      const { data, error } = await supabase
        .from('cargos')
        .update(d)
        .eq('id', id)
        .eq('version', current?.version || 1)
        .select()
        .maybeSingle();
        
      if (error) throw error;
      if (!data) throw new Error('Falha ao atualizar cargo ou conflito de versão.');
      return data;
    })());
  },
  
  async excluir(id: string): Promise<Result<void>> {
    return toResult((async () => {
      const { error } = await supabase.from('cargos').delete().eq('id', id);
      if (error) throw error;
    })());
  },
};

