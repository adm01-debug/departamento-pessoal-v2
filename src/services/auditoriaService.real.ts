// V16-015: AuditoriaService - Production Ready
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import type { Auditoria, Insertable } from '@/integrations/supabase/database.types';

export interface AuditoriaFilters {
  empresa_id?: string;
  usuario_id?: string;
  acao?: string;
  tabela?: string;
  data_inicio?: string;
  data_fim?: string;
}

export const auditoriaServiceReal = {
  async getAll(filters: AuditoriaFilters = {}, limit = 100): Promise<Auditoria[]> {
    let query = supabase
      .from('auditoria')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (filters.empresa_id) query = query.eq('empresa_id', filters.empresa_id);
    if (filters.usuario_id) query = query.eq('usuario_id', filters.usuario_id);
    if (filters.acao) query = query.eq('acao', filters.acao);
    if (filters.tabela) query = query.eq('tabela', filters.tabela);
    if (filters.data_inicio) query = query.gte('created_at', filters.data_inicio);
    if (filters.data_fim) query = query.lte('created_at', filters.data_fim);

    const { data, error } = await query;
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  async log(params: {
    empresaId?: string;
    usuarioId: string;
    usuarioNome?: string;
    acao: 'create' | 'update' | 'delete' | 'view' | 'export' | 'login' | 'logout';
    tabela?: string;
    registroId?: string;
    dadosAnteriores?: Record<string, unknown>;
    dadosNovos?: Record<string, unknown>;
  }): Promise<void> {
    const { error } = await supabase.from('auditoria').insert({
      empresa_id: params.empresaId,
      usuario_id: params.usuarioId,
      usuario_nome: params.usuarioNome,
      acao: params.acao,
      tabela: params.tabela,
      registro_id: params.registroId,
      dados_anteriores: params.dadosAnteriores as any,
      dados_novos: params.dadosNovos as any,
      ip_address: await this.getClientIP(),
      user_agent: navigator.userAgent,
    });

    if (error) console.error('Erro ao registrar auditoria:', error);
  },

  async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  },

  async getResumoAcoes(empresaId: string, dias: number = 30): Promise<Record<string, number>> {
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);

    const { data, error } = await supabase
      .from('auditoria')
      .select('acao')
      .eq('empresa_id', empresaId)
      .gte('created_at', dataInicio.toISOString());

    if (error) throw new Error(handleSupabaseError(error));

    return (data || []).reduce((acc, { acao }) => {
      acc[acao] = (acc[acao] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  },

  async getAtividadeUsuarios(empresaId: string, dias: number = 7): Promise<Array<{ usuario: string; acoes: number }>> {
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);

    const { data, error } = await supabase
      .from('auditoria')
      .select('usuario_nome')
      .eq('empresa_id', empresaId)
      .gte('created_at', dataInicio.toISOString());

    if (error) throw new Error(handleSupabaseError(error));

    const grouped = (data || []).reduce((acc, { usuario_nome }) => {
      const nome = usuario_nome || 'Desconhecido';
      acc[nome] = (acc[nome] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([usuario, acoes]) => ({ usuario, acoes }))
      .sort((a, b) => b.acoes - a.acoes);
  },
};

export default auditoriaServiceReal;
