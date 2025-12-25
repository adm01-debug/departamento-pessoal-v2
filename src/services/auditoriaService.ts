/**
 * @fileoverview Service para operações de auditoria
 * @module services/auditoriaService
 */
import { supabase } from '@/integrations/supabase/client';
import { AuditLog, AuditFilters, AuditStats } from '@/types/auditoria';
import { logger } from '@/lib/logger';

export const auditoriaService = {
  async registrar(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .insert({ ...log, timestamp: new Date().toISOString() })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao registrar log de auditoria:', error);
      throw error;
    }
  },

  async listar(filters?: AuditFilters): Promise<AuditLog[]> {
    try {
      let query = supabase.from('audit_logs').select('id, usuario_id, acao, entidade, entidade_id, dados_anteriores, dados_novos, ip, user_agent, timestamp, empresa_id');
      
      if (filters?.usuario_id) query = query.eq('usuario_id', filters.usuario_id);
      if (filters?.acao) query = query.eq('acao', filters.acao);
      if (filters?.entidade) query = query.eq('entidade', filters.entidade);
      if (filters?.data_inicio) query = query.gte('timestamp', filters.data_inicio);
      if (filters?.data_fim) query = query.lte('timestamp', filters.data_fim);
      
      const { data, error } = await query.order('timestamp', { ascending: false }).limit(1000);
      if (error) throw error;
      return data ?? [];
    } catch (error) {
      logger.error('Erro ao listar logs de auditoria:', error);
      throw error;
    }
  },

  async obterEstatisticas(empresa_id?: string): Promise<AuditStats> {
    try {
      const logs = await this.listar(empresa_id ? { empresa_id } : undefined);
      
      return {
        total_acoes: logs.length,
        por_acao: logs.reduce((acc, l) => ({ ...acc, [l.acao]: (acc[l.acao] ?? 0) + 1 }), {} as Record<string, number>),
        por_usuario: logs.reduce((acc, l) => ({ ...acc, [l.usuario_id]: (acc[l.usuario_id] ?? 0) + 1 }), {} as Record<string, number>),
        por_entidade: logs.reduce((acc, l) => ({ ...acc, [l.entidade]: (acc[l.entidade] ?? 0) + 1 }), {} as Record<string, number>),
      };
    } catch (error) {
      logger.error('Erro ao obter estatísticas de auditoria:', error);
      throw error;
    }
  },

  async limparAntigos(diasRetencao: number = 90): Promise<number> {
    try {
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - diasRetencao);
      
      const { data, error } = await supabase
        .from('audit_logs')
        .delete()
        .lt('timestamp', dataLimite.toISOString())
        .select('id');
      
      if (error) throw error;
      return data?.length ?? 0;
    } catch (error) {
      logger.error('Erro ao limpar logs antigos:', error);
      throw error;
    }
  },
};

export default auditoriaService;
