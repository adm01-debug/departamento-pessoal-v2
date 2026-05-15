import { supabase } from '@/integrations/supabase/client';
import { Result, Ok, Err, toResult } from '@/types/result';

export const contratoService = {
  async listar(empresaId?: string): Promise<Result<any[]>> {
    return toResult((async () => {
      let query = supabase.from('contratos').select('*, colaborador:colaboradores(nome_completo)').order('data_inicio', { ascending: false });
      if (empresaId) query = query.eq('empresa_id', empresaId);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    })());
  },
  
  async buscarPorId(id: string): Promise<Result<any | null>> {
    return toResult((async () => {
      const { data, error } = await supabase.from('contratos').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data;
    })());
  },
  
  async buscarPorColaborador(colaboradorId: string): Promise<Result<any[]>> {
    return toResult((async () => {
      const { data, error } = await supabase.from('contratos').select('*').eq('colaborador_id', colaboradorId).order('data_inicio', { ascending: false });
      if (error) throw error;
      return data || [];
    })());
  },
  
  async criar(d: any): Promise<Result<any>> {
    return toResult((async () => {
      const { data, error } = await supabase.from('contratos').insert(d).select().maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Nenhum registro de contrato foi retornado.');
      return data;
    })());
  },
  
  async atualizar(id: string, d: any): Promise<Result<any>> {
    return toResult((async () => {
      const { data, error } = await supabase.from('contratos').update(d).eq('id', id).select().maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Nenhum registro de contrato foi retornado.');
      return data;
    })());
  },
  
  async encerrar(id: string, motivo: string): Promise<Result<any>> {
    return this.atualizar(id, { status: 'encerrado', observacoes: motivo });
  },
  
  async renovar(id: string, novaDataFim: string): Promise<Result<any>> {
    return this.atualizar(id, { data_fim: novaDataFim, status: 'ativo' });
  },
};

