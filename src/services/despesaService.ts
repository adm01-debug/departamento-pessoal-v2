import { supabase } from '@/integrations/supabase/client';
import { Result, Ok, Err, toResult } from '@/types/result';

export const despesaService = {
  async listar(empresaId?: string): Promise<Result<any[]>> {
    return toResult((async () => {
      let q = supabase.from('despesas').select('*, colaborador:colaboradores(nome_completo)').order('data_despesa', { ascending: false });
      if (empresaId) q = q.eq('empresa_id', empresaId);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    })());
  },
  
  async criar(d: any): Promise<Result<any>> {
    return toResult((async () => {
      const { data, error } = await supabase.from('despesas').insert(d).select().maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Nenhum registro de despesa foi retornado.');
      return data;
    })());
  },
  
  async aprovar(id: string, aprovadoPor?: string | null, obs?: string): Promise<Result<any>> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const aprovadorId = aprovadoPor || authData.user?.id || null;
      const { data, error } = await supabase
        .from('despesas')
        .update({ status: 'aprovada', aprovado_por: aprovadorId, aprovado_em: new Date().toISOString(), observacoes_aprovador: obs })
        .eq('id', id)
        .select()
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Nenhum registro de despesa foi retornado.');
      return Ok(data);
    } catch (e: any) {
      return Err({
        type: 'SERVER_ERROR',
        severity: 'error',
        message: 'Falha ao aprovar despesa',
        timestamp: new Date()
      });
    }
  },
  
  async rejeitar(id: string, aprovadoPor?: string | null, obs?: string): Promise<Result<any>> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const aprovadorId = aprovadoPor || authData.user?.id || null;
      const { data, error } = await supabase
        .from('despesas')
        .update({ status: 'rejeitada', aprovado_por: aprovadorId, aprovado_em: new Date().toISOString(), observacoes_aprovador: obs })
        .eq('id', id)
        .select()
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Nenhum registro de despesa foi retornado.');
      return Ok(data);
    } catch (e: any) {
      return Err({
        type: 'SERVER_ERROR',
        severity: 'error',
        message: 'Falha ao rejeitar despesa',
        timestamp: new Date()
      });
    }
  },
  
  async reembolsar(id: string): Promise<Result<any>> {
    return toResult((async () => {
      const { data, error } = await supabase.from('despesas').update({ status: 'reembolsada' }).eq('id', id).select().maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Nenhum registro de despesa foi retornado.');
      return data;
    })());
  },
  
  async excluir(id: string): Promise<Result<void>> {
    return toResult((async () => {
      const { error } = await supabase.from('despesas').delete().eq('id', id);
      if (error) throw error;
    })());
  },
};

