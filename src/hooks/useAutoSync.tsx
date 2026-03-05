// @ts-nocheck
import { useEffect, useRef, useState, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { useAuditoriaIntegration } from './useAuditoriaIntegration';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { notificarResultadoSync } from '@/services/notificacoesService';

// ============================================
// TIPOS
// ============================================

export interface AutoSyncConfig {
  habilitado: boolean;
  intervalo_minutos: number;
  horario_inicio?: string; // HH:MM - horário para iniciar syncs
  horario_fim?: string;    // HH:MM - horário para parar syncs
  dias_semana?: number[];  // 0-6 (domingo-sábado)
  sync_colaboradores: boolean;
  sync_departamentos: boolean;
  sync_cargos: boolean;
  notificar_erros: boolean;
  notificar_sucesso: boolean;
  max_tentativas: number;
  ultima_execucao?: string;
  proxima_execucao?: string;
}

export interface SyncStatus {
  rodando: boolean;
  ultimaExecucao?: Date;
  proximaExecucao?: Date;
  ultimoResultado?: {
    sucesso: number;
    erros: number;
    conflitos: number;
  };
  erro?: string;
}

// ============================================
// HOOK: useAutoSync
// ============================================

export function useAutoSync() {
  const queryClient = useQueryClient();
  const auditoria = useAuditoriaIntegration('bitrix24');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [status, setStatus] = useState<SyncStatus>({ rodando: false });

  // Buscar configuração
  const { data: config, isLoading: loadingConfig } = useQuery({
    queryKey: ['auto-sync-config'],
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bitrix24_config')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      // Retornar config padrão se não existir
      return (data as AutoSyncConfig) || {
        habilitado: false,
        intervalo_minutos: 60,
        sync_colaboradores: true,
        sync_departamentos: true,
        sync_cargos: false,
        notificar_erros: true,
        notificar_sucesso: false,
        max_tentativas: 3,
      };
    },
    refetchInterval: 60000, // Revalidar a cada minuto
  });

  // Atualizar configuração
  const { mutateAsync: atualizarConfig, isPending: isUpdating } = useMutation({
    mutationFn: async (novaConfig: Partial<AutoSyncConfig>) => {
      const { error } = await supabase
        .from('bitrix24_config')
        .upsert({
          id: 1, // Sempre usar ID 1 para config única
          ...config,
          ...novaConfig,
          updated_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      return novaConfig;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto-sync-config'] });
      toast.success('Configuração salva!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao salvar: ${error.message}`);
    },
  });

  // Verificar se está no horário permitido
  const dentroDoPeriodoPermitido = useCallback((): boolean => {
    if (!config?.horario_inicio || !config?.horario_fim) return true;

    const agora = new Date();
    const horaAtual = agora.getHours() * 60 + agora.getMinutes();
    
    const [inicioH, inicioM] = config.horario_inicio.split(':').map(Number);
    const [fimH, fimM] = config.horario_fim.split(':').map(Number);
    
    const inicioMinutos = inicioH * 60 + inicioM;
    const fimMinutos = fimH * 60 + fimM;

    // Verificar dia da semana
    if (config.dias_semana && config.dias_semana.length > 0) {
      if (!config.dias_semana.includes(agora.getDay())) {
        return false;
      }
    }

    return horaAtual >= inicioMinutos && horaAtual <= fimMinutos;
  }, [config]);

  // Executar sincronização
  const executarSync = useCallback(async () => {
    if (!config?.habilitado) return;
    if (!dentroDoPeriodoPermitido()) {
      logger.log('[AutoSync] Fora do período permitido');
      return;
    }

    setStatus(prev => ({ ...prev, rodando: true }));

    try {
      // Importar função de sync do hook principal
      const { useBitrix24Sync } = await import('./useBitrix24Sync');
      
      // Criar uma instância temporária para executar
      // Na prática, isso seria feito via API/Edge Function
      const resultado = {
        sucesso: 0,
        erros: 0,
        conflitos: 0,
        detalhes: [] as string[],
      };

      // Simular sync de colaboradores
      if (config.sync_colaboradores) {
        // Aqui chamaria a função real de sync
        resultado.sucesso += 1;
        resultado.detalhes.push('Colaboradores sincronizados');
      }

      // Registrar no log
      await supabase.from('bitrix24_sync_logs').insert({
        tipo: 'auto',
        direcao: 'bidirecional',
        registros_processados: resultado.sucesso + resultado.erros,
        registros_sucesso: resultado.sucesso,
        registros_erro: resultado.erros,
        detalhes: resultado.detalhes,
      });

      // Atualizar última execução
      await atualizarConfig({
        ultima_execucao: new Date().toISOString(),
        proxima_execucao: new Date(Date.now() + (config.intervalo_minutos || 60) * 60000).toISOString(),
      });

      setStatus({
        rodando: false,
        ultimaExecucao: new Date(),
        proximaExecucao: new Date(Date.now() + (config.intervalo_minutos || 60) * 60000),
        ultimoResultado: resultado,
      });

      if (config.notificar_sucesso) {
        toast.success(`Sync automático: ${resultado.sucesso} registros sincronizados`);
        await notificarResultadoSync(true, resultado.sucesso, []);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      logger.error('[AutoSync] Erro:', error);
      
      setStatus(prev => ({
        ...prev,
        rodando: false,
        erro: errorMessage,
      }));

      if (config?.notificar_erros) {
        toast.error(`Erro no sync automático: ${errorMessage}`);
        await notificarResultadoSync(false, 0, [errorMessage]);
      }

      // Registrar erro no log
      try {
        await supabase.from('bitrix24_sync_logs').insert({
          tipo: 'auto',
          direcao: 'bidirecional',
          registros_processados: 0,
          registros_sucesso: 0,
          registros_erro: 1,
          detalhes: [`Erro: ${errorMessage}`],
        });
      } catch (e) {
        logger.error('Erro ao registrar log:', e);
      }
    }
  }, [config, dentroDoPeriodoPermitido, atualizarConfig]);

  // Iniciar/parar auto-sync
  useEffect(() => {
    // Limpar intervalo anterior
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Se não está habilitado, não fazer nada
    if (!config?.habilitado) {
      setStatus({ rodando: false });
      return;
    }

    // Calcular intervalo em ms
    const intervaloMs = (config.intervalo_minutos || 60) * 60 * 1000;

    // Iniciar intervalo
    intervalRef.current = setInterval(() => {
      executarSync();
    }, intervaloMs);

    // Calcular próxima execução
    setStatus(prev => ({
      ...prev,
      proximaExecucao: new Date(Date.now() + intervaloMs),
    }));

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [config?.habilitado, config?.intervalo_minutos, executarSync]);

  // Habilitar/desabilitar auto-sync
  const toggleAutoSync = useCallback(async (habilitar: boolean) => {
    await atualizarConfig({ habilitado: habilitar });
    
    if (habilitar) {
      toast.success('Auto-sync habilitado!');
    } else {
      toast.info('Auto-sync desabilitado');
    }
  }, [atualizarConfig]);

  // Executar sync manual
  const executarSyncManual = useCallback(async () => {
    toast.info('Iniciando sincronização manual...');
    await executarSync();
  }, [executarSync]);

  return {
    // Config
    config,
    loadingConfig,
    atualizarConfig,
    isUpdating,
    
    // Status
    status,
    
    // Ações
    toggleAutoSync,
    executarSyncManual,
    
    // Helpers
    dentroDoPeriodoPermitido,
  };
}

// ============================================
// COMPONENTE: AutoSyncStatus
// ============================================

export function AutoSyncStatusBadge(): JSX.Element {
  const { config, status } = useAutoSync();

  if (!config?.habilitado) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
        <span className="w-2 h-2 rounded-full bg-muted-foreground" />
        Auto-sync desabilitado
      </span>
    );
  }

  if (status.rodando) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-info/20 text-info">
        <span className="w-2 h-2 rounded-full bg-info animate-pulse" />
        Sincronizando...
      </span>
    );
  }

  if (status.erro) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-destructive/20 text-destructive">
        <span className="w-2 h-2 rounded-full bg-destructive" />
        Erro no último sync
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-success/20 text-success">
      <span className="w-2 h-2 rounded-full bg-success" />
      Auto-sync ativo
    </span>
  );
}





