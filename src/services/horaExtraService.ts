import { supabase } from '@/integrations/supabase/client';
import { Result, Ok, Err, toResult } from '@/types/result';

export const horaExtraService = {
  async listar(empresaId?: string): Promise<Result<any[]>> {
    return toResult((async () => {
      let query = supabase
        .from('solicitacoes_hora_extra')
        .select('*, colaborador:colaboradores(nome_completo)')
        .order('created_at', { ascending: false });
      if (empresaId) query = query.eq('empresa_id', empresaId);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    })());
  },
  
  async criar(d: any): Promise<Result<any>> {
    return toResult((async () => {
      const { data, error } = await supabase.from('solicitacoes_hora_extra').insert(d).select().maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Nenhum registro de solicitação de hora extra foi retornado.');
      return data;
    })());
  },
  
  async aprovar(id: string, aprovadoPor: string, obs?: string): Promise<Result<any>> {
    return toResult((async () => {
      const { data, error } = await supabase
        .from('solicitacoes_hora_extra')
        .update({ status: 'aprovada', aprovado_por: aprovadoPor, aprovado_em: new Date().toISOString(), observacoes_aprovador: obs })
        .eq('id', id).select().maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Nenhum registro de solicitação foi retornado.');
      return data;
    })());
  },
  
  async rejeitar(id: string, aprovadoPor: string, obs?: string): Promise<Result<any>> {
    return toResult((async () => {
      const { data, error } = await supabase
        .from('solicitacoes_hora_extra')
        .update({ status: 'rejeitada', aprovado_por: aprovadoPor, aprovado_em: new Date().toISOString(), observacoes_aprovador: obs })
        .eq('id', id).select().maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Nenhum registro de solicitação foi retornado.');
      return data;
    })());
  },
  
  async excluir(id: string): Promise<Result<void>> {
    return toResult((async () => {
      const { error } = await supabase.from('solicitacoes_hora_extra').delete().eq('id', id);
      if (error) throw error;
    })());
  },
};

