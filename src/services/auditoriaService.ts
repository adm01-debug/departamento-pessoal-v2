import { supabase } from '@/integrations/supabase/client';

export const auditoriaService = {
  async listar(filtros?: { 
    tabela?: string; 
    acao?: string; 
    colaborador_id?: string;
    registro_id?: string;
    data_inicio?: string;
    data_fim?: string;
    limite?: number 
  }) {
    let query = supabase.from('audit_log').select('*').order('created_at', { ascending: false });
    
    if (filtros?.tabela) query = query.eq('tabela', filtros.tabela);
    if (filtros?.acao) query = query.eq('acao', filtros.acao);
    if (filtros?.registro_id) query = query.eq('registro_id', filtros.registro_id);
    
    // Filtro por período
    if (filtros?.data_inicio) query = query.gte('created_at', filtros.data_inicio);
    if (filtros?.data_fim) query = query.lte('created_at', filtros.data_fim);
    
    if (filtros?.limite) query = query.limit(filtros.limite);
    
    const { data, error } = await query;
    if (error) throw error;
    
    return data || [];
  },

  /** Registra log com suporte a versionamento (optimistic locking) */
  async logComVersao(params: {
    tabela: string;
    registro_id: string;
    acao: 'UPDATE' | 'DELETE';
    dados_anteriores: any;
    dados_novos?: any;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from('audit_log').insert({
      tabela: params.tabela,
      registro_id: params.registro_id,
      acao: params.acao,
      dados_anteriores: params.dados_anteriores,
      dados_novos: params.dados_novos || null,
      user_id: user?.id,
      user_email: user?.email,
    });
  }
};

export const notificacaoService = {
  async listar(userId?: string) {
    let query = supabase.from('notificacoes').select('*').order('created_at', { ascending: false }).limit(50);
    if (userId) query = query.eq('user_id', userId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  async marcarComoLida(id: string) {
    const { error } = await supabase.from('notificacoes').update({ lida: true }).eq('id', id);
    if (error) throw error;
  },
  async marcarTodasComoLidas(userId: string) {
    const { error } = await supabase.from('notificacoes').update({ lida: true }).eq('user_id', userId).eq('lida', false);
    if (error) throw error;
  },
};
