// @ts-nocheck
// V18: NotificacaoService - Sistema de Notificações Completo
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';

export type TipoNotificacao = 
  | 'info' 
  | 'alerta' 
  | 'urgente' 
  | 'sucesso' 
  | 'erro';

export type CategoriaNotificacao = 
  | 'ferias' 
  | 'folha' 
  | 'ponto' 
  | 'documentos' 
  | 'esocial' 
  | 'sistema'
  | 'vencimento'
  | 'aniversario';

export interface Notificacao {
  id: string;
  usuario_id: string;
  empresa_id: string;
  titulo: string;
  mensagem: string;
  tipo: TipoNotificacao;
  categoria: CategoriaNotificacao;
  lida: boolean;
  link?: string;
  dados?: Record<string, any>;
  created_at: string;
  read_at?: string;
}

export interface NotificacaoConfig {
  email: boolean;
  push: boolean;
  inApp: boolean;
  categorias: CategoriaNotificacao[];
}

export const notificacaoServiceReal = {
  /**
   * Lista notificações do usuário
   */
  async listar(usuarioId: string, apenasNaoLidas: boolean = false): Promise<Notificacao[]> {
    let query = supabase
      .from('notificacoes')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (apenasNaoLidas) {
      query = query.eq('lida', false);
    }

    const { data, error } = await query;
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  /**
   * Conta notificações não lidas
   */
  async contarNaoLidas(usuarioId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notificacoes')
      .select('*', { count: 'exact', head: true })
      .eq('usuario_id', usuarioId)
      .eq('lida', false);

    if (error) throw new Error(handleSupabaseError(error));
    return count || 0;
  },

  /**
   * Cria nova notificação
   */
  async criar(notificacao: Omit<Notificacao, 'id' | 'created_at' | 'lida'>): Promise<Notificacao> {
    const { data, error } = await supabase
      .from('notificacoes')
      .insert({
        ...notificacao,
        lida: false
      })
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  /**
   * Marca notificação como lida
   */
  async marcarComoLida(id: string): Promise<void> {
    const { error } = await supabase
      .from('notificacoes')
      .update({ 
        lida: true, 
        read_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) throw new Error(handleSupabaseError(error));
  },

  /**
   * Marca todas como lidas
   */
  async marcarTodasComoLidas(usuarioId: string): Promise<void> {
    const { error } = await supabase
      .from('notificacoes')
      .update({ 
        lida: true, 
        read_at: new Date().toISOString() 
      })
      .eq('usuario_id', usuarioId)
      .eq('lida', false);

    if (error) throw new Error(handleSupabaseError(error));
  },

  /**
   * Exclui notificação
   */
  async excluir(id: string): Promise<void> {
    const { error } = await supabase
      .from('notificacoes')
      .delete()
      .eq('id', id);

    if (error) throw new Error(handleSupabaseError(error));
  },

  /**
   * Exclui notificações antigas
   */
  async limparAntigas(usuarioId: string, diasManter: number = 30): Promise<number> {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - diasManter);

    const { data, error } = await supabase
      .from('notificacoes')
      .delete()
      .eq('usuario_id', usuarioId)
      .eq('lida', true)
      .lt('created_at', dataLimite.toISOString())
      .select();

    if (error) throw new Error(handleSupabaseError(error));
    return data?.length || 0;
  },

  /**
   * Envia notificação para múltiplos usuários
   */
  async enviarParaGrupo(
    usuarioIds: string[],
    notificacao: Omit<Notificacao, 'id' | 'created_at' | 'lida' | 'usuario_id'>
  ): Promise<void> {
    const notificacoes = usuarioIds.map(usuario_id => ({
      ...notificacao,
      usuario_id,
      lida: false
    }));

    const { error } = await supabase
      .from('notificacoes')
      .insert(notificacoes);

    if (error) throw new Error(handleSupabaseError(error));
  },

  /**
   * Obtém configurações de notificação do usuário
   */
  async getConfig(usuarioId: string): Promise<NotificacaoConfig> {
    const { data, error } = await supabase
      .from('notificacao_configs')
      .select('*')
      .eq('usuario_id', usuarioId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(handleSupabaseError(error));
    }

    return data || {
      email: true,
      push: true,
      inApp: true,
      categorias: ['ferias', 'folha', 'ponto', 'esocial', 'sistema', 'vencimento']
    };
  },

  /**
   * Atualiza configurações
   */
  async atualizarConfig(usuarioId: string, config: Partial<NotificacaoConfig>): Promise<void> {
    const { error } = await supabase
      .from('notificacao_configs')
      .upsert({
        usuario_id: usuarioId,
        ...config
      });

    if (error) throw new Error(handleSupabaseError(error));
  }
};

export default notificacaoServiceReal;
