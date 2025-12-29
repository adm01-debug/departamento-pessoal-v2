/**
 * @fileoverview Service para backup e restore
 * @module services/backupService
 * @version V8.4 - Refatorado com logger e error handling
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { Backup, BackupConfig } from '@/types/backup';

// ============================================
// TIPOS
// ============================================

export type BackupTipo = 'completo' | 'incremental' | 'diferencial' | 'manual' | 'automatico';
export type BackupStatus = 'pendente' | 'em_progresso' | 'concluido' | 'erro' | 'cancelado';

interface BackupFilters {
  tipo?: BackupTipo;
  status?: BackupStatus;
  dataInicio?: string;
  dataFim?: string;
  limit?: number;
}

interface BackupStats {
  total: number;
  concluidos: number;
  pendentes: number;
  erros: number;
  ultimoBackup: string | null;
  tamanhoTotal: number;
}

// ============================================
// SERVICE
// ============================================

export const backupService = {
  /**
   * Lista backups com filtros opcionais
   */
  async listar(filters?: BackupFilters): Promise<Backup[]> {
    try {
      logger.info('[BackupService] Listando backups', { filters });

      let query = supabase
        .from('backups')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.tipo) {
        query = query.eq('tipo', filters.tipo);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.dataInicio) {
        query = query.gte('created_at', filters.dataInicio);
      }
      if (filters?.dataFim) {
        query = query.lte('created_at', filters.dataFim);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('[BackupService] Erro ao listar backups', { error });
        throw new Error(`Erro ao listar backups: ${error.message}`);
      }

      logger.debug('[BackupService] Backups listados', { count: data?.length ?? 0 });
      return data ?? [];
    } catch (error) {
      logger.error('[BackupService] Exceção ao listar backups', { error });
      throw error;
    }
  },

  /**
   * Cria um novo backup
   */
  async criar(tipo: BackupTipo = 'manual'): Promise<Backup> {
    try {
      logger.info('[BackupService] Criando backup', { tipo });

      const { data, error } = await supabase
        .from('backups')
        .insert({
          tipo,
          status: 'pendente',
          created_at: new Date().toISOString(),
          tamanho: 0,
          tabelas_count: 0,
          registros_count: 0,
        })
        .select()
        .single();

      if (error) {
        logger.error('[BackupService] Erro ao criar backup', { error });
        throw new Error(`Erro ao criar backup: ${error.message}`);
      }

      logger.info('[BackupService] Backup criado', { id: data.id, tipo });
      return data;
    } catch (error) {
      logger.error('[BackupService] Exceção ao criar backup', { error });
      throw error;
    }
  },

  /**
   * Busca configuração de backup
   */
  async buscarConfig(): Promise<BackupConfig | null> {
    try {
      logger.info('[BackupService] Buscando configuração de backup');

      const { data, error } = await supabase
        .from('backup_config')
        .select('*')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          logger.warn('[BackupService] Configuração não encontrada');
          return null;
        }
        logger.error('[BackupService] Erro ao buscar configuração', { error });
        throw new Error(`Erro ao buscar configuração: ${error.message}`);
      }

      return data;
    } catch (error) {
      logger.error('[BackupService] Exceção ao buscar configuração', { error });
      throw error;
    }
  },

  /**
   * Atualiza configuração de backup
   */
  async atualizarConfig(config: Partial<BackupConfig>): Promise<BackupConfig> {
    try {
      logger.info('[BackupService] Atualizando configuração', { 
        frequency: config.frequency,
        retention_days: config.retention_days 
      });

      const { data, error } = await supabase
        .from('backup_config')
        .upsert({
          ...config,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        logger.error('[BackupService] Erro ao atualizar configuração', { error });
        throw new Error(`Erro ao atualizar configuração: ${error.message}`);
      }

      logger.info('[BackupService] Configuração atualizada');
      return data;
    } catch (error) {
      logger.error('[BackupService] Exceção ao atualizar configuração', { error });
      throw error;
    }
  },

  /**
   * Restaura um backup
   */
  async restaurar(backupId: string): Promise<void> {
    try {
      if (!backupId) {
        throw new Error('ID do backup é obrigatório');
      }

      logger.warn('[BackupService] Iniciando restauração de backup', { backupId });

      // Verificar se o backup existe e está concluído
      const { data: backup, error: fetchError } = await supabase
        .from('backups')
        .select('*')
        .eq('id', backupId)
        .single();

      if (fetchError) {
        logger.error('[BackupService] Backup não encontrado', { backupId });
        throw new Error('Backup não encontrado');
      }

      if (backup.status !== 'concluido') {
        logger.error('[BackupService] Backup não está concluído', { backupId, status: backup.status });
        throw new Error('Apenas backups concluídos podem ser restaurados');
      }

      // Executar restauração
      const { error } = await supabase.rpc('restaurar_backup', { backup_id: backupId });

      if (error) {
        logger.error('[BackupService] Erro ao restaurar backup', { error, backupId });
        throw new Error(`Erro ao restaurar backup: ${error.message}`);
      }

      logger.info('[BackupService] Backup restaurado com sucesso', { backupId });
    } catch (error) {
      logger.error('[BackupService] Exceção ao restaurar backup', { error, backupId });
      throw error;
    }
  },

  /**
   * Exclui um backup
   */
  async excluir(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('ID do backup é obrigatório');
      }

      logger.info('[BackupService] Excluindo backup', { id });

      const { error } = await supabase
        .from('backups')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('[BackupService] Erro ao excluir backup', { error, id });
        throw new Error(`Erro ao excluir backup: ${error.message}`);
      }

      logger.info('[BackupService] Backup excluído', { id });
    } catch (error) {
      logger.error('[BackupService] Exceção ao excluir backup', { error, id });
      throw error;
    }
  },

  /**
   * Atualiza status de um backup
   */
  async atualizarStatus(id: string, status: BackupStatus, metadata?: Record<string, unknown>): Promise<void> {
    try {
      logger.info('[BackupService] Atualizando status do backup', { id, status });

      const updateData: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (status === 'concluido') {
        updateData.finished_at = new Date().toISOString();
      }

      if (metadata) {
        Object.assign(updateData, metadata);
      }

      const { error } = await supabase
        .from('backups')
        .update(updateData)
        .eq('id', id);

      if (error) {
        logger.error('[BackupService] Erro ao atualizar status', { error, id });
        throw new Error(`Erro ao atualizar status: ${error.message}`);
      }

      logger.info('[BackupService] Status atualizado', { id, status });
    } catch (error) {
      logger.error('[BackupService] Exceção ao atualizar status', { error, id });
      throw error;
    }
  },

  /**
   * Obtém estatísticas de backups
   */
  async getEstatisticas(): Promise<BackupStats> {
    try {
      logger.info('[BackupService] Obtendo estatísticas');

      const { data, error } = await supabase
        .from('backups')
        .select('status, tamanho, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('[BackupService] Erro ao obter estatísticas', { error });
        throw new Error(`Erro ao obter estatísticas: ${error.message}`);
      }

      const stats: BackupStats = {
        total: data?.length ?? 0,
        concluidos: data?.filter(b => b.status === 'concluido').length ?? 0,
        pendentes: data?.filter(b => b.status === 'pendente' || b.status === 'em_progresso').length ?? 0,
        erros: data?.filter(b => b.status === 'erro').length ?? 0,
        ultimoBackup: data?.[0]?.created_at ?? null,
        tamanhoTotal: data?.reduce((sum, b) => sum + (b.tamanho || 0), 0) ?? 0,
      };

      logger.debug('[BackupService] Estatísticas obtidas', stats);
      return stats;
    } catch (error) {
      logger.error('[BackupService] Exceção ao obter estatísticas', { error });
      throw error;
    }
  },

  /**
   * Limpa backups antigos baseado na política de retenção
   */
  async limparAntigos(diasRetencao: number = 30): Promise<number> {
    try {
      logger.info('[BackupService] Limpando backups antigos', { diasRetencao });

      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - diasRetencao);

      const { data, error } = await supabase
        .from('backups')
        .delete()
        .lt('created_at', dataLimite.toISOString())
        .neq('tipo', 'completo') // Manter backups completos
        .select();

      if (error) {
        logger.error('[BackupService] Erro ao limpar backups antigos', { error });
        throw new Error(`Erro ao limpar backups: ${error.message}`);
      }

      const count = data?.length ?? 0;
      logger.info('[BackupService] Backups antigos removidos', { count, diasRetencao });
      return count;
    } catch (error) {
      logger.error('[BackupService] Exceção ao limpar backups', { error });
      throw error;
    }
  },
};

export default backupService;
