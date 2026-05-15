import { supabase } from '@/integrations/supabase/client';
import { Result, Ok, Err, toResult } from '@/types/result';

export const departamentoService = {
  async listar(empresaId?: string): Promise<Result<any[]>> {
    return toResult((async () => {
      let query = supabase.from('departamentos').select('*').order('nome');
      if (empresaId) query = query.eq('empresa_id', empresaId);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    })());
  },
  
  async buscarPorId(id: string): Promise<Result<any | null>> {
    return toResult((async () => {
      const { data, error } = await supabase.from('departamentos').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data;
    })());
  },
  
  async criar(d: any): Promise<Result<any>> {
    return toResult((async () => {
      const { data, error } = await supabase.from('departamentos').insert(d).select().maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Nenhum registro de departamento foi retornado.');
      return data;
    })());
  },
  
  async atualizar(id: string, d: any): Promise<Result<any>> {
    return toResult((async () => {
      const { data, error } = await supabase.from('departamentos').update(d).eq('id', id).select().maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Nenhum registro de departamento foi retornado.');
      return data;
    })());
  },
  
  async excluir(id: string): Promise<Result<void>> {
    return toResult((async () => {
      const { error } = await supabase.from('departamentos').delete().eq('id', id);
      if (error) throw error;
    })());
  },
};

