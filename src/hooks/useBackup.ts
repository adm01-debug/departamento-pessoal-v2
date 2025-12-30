/**
 * @fileoverview Hook para gerenciamento de backups
 * @module hooks/useBackup
 * @version V8.4
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

// ============================================
// TIPOS
// ============================================

export type BackupTipo = 'completo' | 'incremental' | 'diferencial' | 'manual' | 'automatico';
export type BackupStatus = 'pendente' | 'em_progresso' | 'concluido' | 'erro' | 'cancelado';

export interface Backup {
  id: string;
  tipo: BackupTipo;
  status: BackupStatus;
  tamanho?: number;
  url_download?: string;
  tabelas_count?: number;
  registros_count?: number;
  erro?: string;
  created_at: string;
  finished_at?: string;
  created_by?: string;
}

export interface BackupConfig {
  id?: string;
  automatico: boolean;
  frequencia: 'diario' | 'semanal' | 'mensal';
  horario: string;
  dia_semana?: number;
  dia_mes?: number;
  retencao_dias: number;
  incluir_anexos: boolean;
  notificar_email: boolean;
  email_notificacao?: string;
  updated_at?: string;
}

export interface BackupStats {
  total: number;
  concluidos: number;
  pendentes: number;
  erros: number;
  ultimoBackup: string | null;
  proximoBackup: string | null;
  espacoUsado: number;
}

// ============================================
// QUERIES
// ============================================

const QUERY_KEYS = {
  backups: ['backups'] as const,
  config: ['backup-config'] as const,
  stats: ['backup-stats'] as const,
};

/**
 * Hook principal para gerenciamento de backups
 */
export function useBackup() {
  const queryClient = useQueryClient();

  // Lista de backups
  const {
    data: backups = [],
    isLoading: loadingBackups,
    error: errorBackups,
    refetch: refetchBackups,
  } = useQuery({
    queryKey: QUERY_KEYS.backups,
    queryFn: async (): Promise<Backup[]> => {
      logger.info('[useBackup] Carregando backups');
      
      const { data, error } = await supabase
        .from('backups')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        logger.error('[useBackup] Erro ao carregar backups', { error });
        throw error;
      }

      return data || [];
    },
    staleTime: 30000, // 30 segundos
  });

  // Configuração de backup
  const {
    data: config,
    isLoading: loadingConfig,
  } = useQuery({
    queryKey: QUERY_KEYS.config,
    queryFn: async (): Promise<BackupConfig | null> => {
      logger.info('[useBackup] Carregando configuração');
      
      const { data, error } = await supabase
        .from('backup_config')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        logger.error('[useBackup] Erro ao carregar config', { error });
        throw error;
      }

      return data || {
        automatico: false,
        frequencia: 'diario',
        horario: '03:00',
        retencao_dias: 30,
        incluir_anexos: true,
        notificar_email: false,
      };
    },
    staleTime: 60000, // 1 minuto
  });

  // Estatísticas
  const stats: BackupStats = {
    total: backups.length,
    concluidos: backups.filter(b => b.status === 'concluido').length,
    pendentes: backups.filter(b => b.status === 'pendente' || b.status === 'em_progresso').length,
    erros: backups.filter(b => b.status === 'erro').length,
    ultimoBackup: backups.find(b => b.status === 'concluido')?.created_at || null,
    proximoBackup: null, // Calculado pelo cron
    espacoUsado: backups.reduce((sum, b) => sum + (b.tamanho || 0), 0),
  };

  // ============================================
  // MUTATIONS
  // ============================================

  // Criar backup
  const createBackupMutation = useMutation({
    mutationFn: async (tipo: BackupTipo = 'manual'): Promise<Backup> => {
      logger.info('[useBackup] Criando backup', { tipo });

      const { data, error } = await supabase
        .from('backups')
        .insert({
          tipo,
          status: 'pendente',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        logger.error('[useBackup] Erro ao criar backup', { error });
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.backups });
      toast.success('Backup iniciado! Você será notificado quando concluir.');
    },
    onError: (error) => {
      toast.error('Erro ao iniciar backup');
      logger.error('[useBackup] Mutation error', { error });
    },
  });

  // Restaurar backup
  const restoreBackupMutation = useMutation({
    mutationFn: async (backupId: string): Promise<void> => {
      logger.warn('[useBackup] Iniciando restauração', { backupId });

      const { error } = await supabase.rpc('restaurar_backup', {
        backup_id: backupId,
      });

      if (error) {
        logger.error('[useBackup] Erro ao restaurar', { error });
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Backup restaurado com sucesso!');
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      toast.error('Erro ao restaurar backup');
      logger.error('[useBackup] Restore error', { error });
    },
  });

  // Excluir backup
  const deleteBackupMutation = useMutation({
    mutationFn: async (backupId: string): Promise<void> => {
      logger.info('[useBackup] Excluindo backup', { backupId });

      const { error } = await supabase
        .from('backups')
        .delete()
        .eq('id', backupId);

      if (error) {
        logger.error('[useBackup] Erro ao excluir', { error });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.backups });
      toast.success('Backup excluído');
    },
    onError: () => {
      toast.error('Erro ao excluir backup');
    },
  });

  // Atualizar configuração
  const updateConfigMutation = useMutation({
    mutationFn: async (newConfig: Partial<BackupConfig>): Promise<void> => {
      logger.info('[useBackup] Atualizando configuração', newConfig);

      const { error } = await supabase
        .from('backup_config')
        .upsert({
          ...config,
          ...newConfig,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        logger.error('[useBackup] Erro ao atualizar config', { error });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.config });
      toast.success('Configuração salva');
    },
    onError: () => {
      toast.error('Erro ao salvar configuração');
    },
  });

  // ============================================
  // RETURN
  // ============================================

  return {
    // Dados
    backups,
    config,
    stats,
    
    // Loading states
    loading: loadingBackups || loadingConfig,
    loadingBackups,
    loadingConfig,
    
    // Errors
    error: errorBackups,
    
    // Ações
    createBackup: createBackupMutation.mutate,
    restoreBackup: restoreBackupMutation.mutate,
    deleteBackup: deleteBackupMutation.mutate,
    updateConfig: updateConfigMutation.mutate,
    refetch: refetchBackups,
    
    // Mutation states
    isCreating: createBackupMutation.isPending,
    isRestoring: restoreBackupMutation.isPending,
    isDeleting: deleteBackupMutation.isPending,
    isSavingConfig: updateConfigMutation.isPending,
  };
}

export default useBackup;
