import { supabase } from '@/integrations/supabase/client';
import { Result, Ok, Err, toResult } from '@/types/result';

export const faltasService = {
  async listar(empresaId?: string): Promise<Result<any[]>> {
    return toResult((async () => {
      let q = (supabase as any).from('faltas').select('*, colaborador:colaboradores(nome_completo)').order('data', { ascending: false });
      if (empresaId) q = q.eq('empresa_id', empresaId);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    })());
  },
  
  async buscarPorColaborador(colaboradorId: string): Promise<Result<any[]>> {
    return toResult((async () => {
      const { data, error } = await (supabase as any).from('faltas').select('*').eq('colaborador_id', colaboradorId).order('data', { ascending: false });
      if (error) throw error;
      return data || [];
    })());
  },
  
  async criar(d: any): Promise<Result<any>> {
    return toResult((async () => {
      const { data, error } = await (supabase as any).from('faltas').insert(d).select().maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Nenhum registro de falta foi retornado.');
      return data;
    })());
  },
  
  async atualizar(id: string, d: any): Promise<Result<any>> {
    return toResult((async () => {
      const { data, error } = await (supabase as any).from('faltas').update(d).eq('id', id).select().maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Nenhum registro de falta foi retornado.');
      return data;
    })());
  },
  
  async excluir(id: string): Promise<Result<void>> {
    return toResult((async () => {
      const { error } = await (supabase as any).from('faltas').delete().eq('id', id);
      if (error) throw error;
    })());
  },
};

