/**
 * @fileoverview Service para gerenciamento de configurações
 * @module services/configuracoesService
 */
import { supabase } from '@/integrations/supabase/client';
import type { Configuracao } from '@/types/configuracao';

export const configuracoesService = {
  async buscar(): Promise<Configuracao | null> {
    const { data, error } = await supabase.from('configuracoes').select('*').single();
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  },

  async atualizar(dados: Partial<Configuracao>): Promise<Configuracao> {
    const { data, error } = await supabase.from('configuracoes').upsert(dados).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async atualizarNotificacoes(notificacoes: Configuracao['notificacoes']): Promise<void> {
    const { error } = await supabase.from('configuracoes').update({ notificacoes }).eq('id', 1);
    if (error) throw new Error(error.message);
  },

  async atualizarIntegracoes(integracoes: Configuracao['integracoes']): Promise<void> {
    const { error } = await supabase.from('configuracoes').update({ integracoes }).eq('id', 1);
    if (error) throw new Error(error.message);
  },
};
