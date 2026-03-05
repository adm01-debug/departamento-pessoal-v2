// @ts-nocheck
/**
 * @fileoverview Service para integrações externas
 * @module services/integracoesService
 */
import { supabase } from '@/integrations/supabase/client';
import type { Integracao, LogIntegracao } from '@/types/integracao';

export const integracoesService = {
  async listar(): Promise<Integracao[]> {
    const { data, error } = await supabase.from('integracoes').select('*').order('nome');
    if (error) throw new Error(error.message);
    return data || [];
  },

  async buscarPorTipo(tipo: string): Promise<Integracao | null> {
    const { data, error } = await supabase.from('integracoes').select('*').eq('tipo', tipo).single();
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  },

  async configurar(integracao: Partial<Integracao>): Promise<Integracao> {
    const { data, error } = await supabase.from('integracoes').upsert(integracao).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async testarConexao(tipo: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('testar_integracao', { tipo });
      return !error;
    } catch { return false; }
  },

  async buscarLogs(integracaoId: string): Promise<LogIntegracao[]> {
    const { data, error } = await supabase.from('logs_integracoes').select('*').eq('integracao_id', integracaoId).order('created_at', { ascending: false }).limit(100);
    if (error) throw new Error(error.message);
    return data || [];
  },

  async sincronizar(tipo: string): Promise<void> {
    const { error } = await supabase.rpc('sincronizar_integracao', { tipo });
    if (error) throw new Error(error.message);
  },
};
