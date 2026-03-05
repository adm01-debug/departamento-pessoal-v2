// @ts-nocheck
/**
 * @fileoverview Hook para integração de auditoria
 * @module hooks/useAuditoriaIntegration
 */
import { useCallback } from 'react';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type EntidadeAuditoria = 
  | 'colaborador'
  | 'admissao'
  | 'desligamento'
  | 'ferias'
  | 'ponto'
  | 'folha'
  | 'beneficio'
  | 'afastamento'
  | 'esocial'
  | 'bitrix24'
  | 'bitrix24_sync'
  | 'folha_calculo'
  | 'periodos_aquisitivos';

export type AcaoAuditoria = 
  | 'criar'
  | 'editar'
  | 'excluir'
  | 'visualizar'
  | 'aprovar'
  | 'rejeitar'
  | 'exportar'
  | 'importar'
  | 'calcular'
  | 'sync';

interface LogAuditoria {
  acao: AcaoAuditoria;
  entidade: EntidadeAuditoria;
  entidade_id?: string;
  descricao: string;
  dados_anteriores?: Record<string, unknown>;
  dados_novos?: Record<string, unknown>;
}

/**
 * Hook simplificado para integração de auditoria
 * Uso: const auditoria = useAuditoriaIntegration('colaborador');
 *      await auditoria.registrarCriacao(id, dados);
 */
export interface UseAuditoriaIntegrationReturn {
  registrarCriacao: (entidadeId: string, dados: Record<string, unknown>) => Promise<void>;
  registrarAlteracao: (entidadeId: string, dadosAnteriores: Record<string, unknown>, dadosNovos: Record<string, unknown>) => Promise<void>;
  registrarExclusao: (entidadeId: string, dados: Record<string, unknown>) => Promise<void>;
  aprovar: (entidadeId: string, detalhes?: Record<string, unknown>) => Promise<void>;
  rejeitar: (entidadeId: string, detalhes?: Record<string, unknown>) => Promise<void>;
  calcular: (entidadeId: string, detalhes?: Record<string, unknown>) => Promise<void>;
  exportar: (entidadeId: string, detalhes?: Record<string, unknown>) => Promise<void>;
  registrarLog: (log: LogAuditoria) => Promise<void>;
}

export function useAuditoriaIntegration(entidade?: EntidadeAuditoria): UseAuditoriaIntegrationReturn {
  const { user } = useAuth();
  const entidadePadrao = entidade || 'colaborador';

  const registrarLog = useCallback(async (log: Omit<LogAuditoria, 'entidade'>) => {
    try {
      // Log no console para debug
      logger.log('[Auditoria]', log.acao, entidadePadrao, log.entidade_id);
      
      // Tentar inserir na tabela audit_log (padrão do sistema)
      await supabase.from('audit_log').insert({
        acao: log.acao.toUpperCase() === 'CRIAR' ? 'INSERT' : 
              log.acao.toUpperCase() === 'EDITAR' ? 'UPDATE' : 
              log.acao.toUpperCase() === 'EXCLUIR' ? 'DELETE' : 'UPDATE',
        tabela: entidadePadrao,
        registro_id: log.entidade_id || 'N/A',
        dados_anteriores: log.dados_anteriores,
        dados_novos: log.dados_novos,
        user_id: user?.id,
        user_email: user?.email,
      });
    } catch (error) {
      logger.error('Erro ao registrar auditoria:', error);
    }
  }, [entidadePadrao, user]);

  const registrarCriacao = useCallback(async (
    id: string,
    dados?: Record<string, unknown>
  ) => {
    await registrarLog({
      acao: 'criar',
      entidade_id: id,
      descricao: `Criação de ${entidadePadrao}`,
      dados_novos: dados,
    });
  }, [registrarLog, entidadePadrao]);

  const registrarAlteracao = useCallback(async (
    id: string,
    dadosAnteriores?: Record<string, unknown>,
    dadosNovos?: Record<string, unknown>
  ) => {
    await registrarLog({
      acao: 'editar',
      entidade_id: id,
      descricao: `Alteração de ${entidadePadrao}`,
      dados_anteriores: dadosAnteriores,
      dados_novos: dadosNovos,
    });
  }, [registrarLog, entidadePadrao]);

  const registrarExclusao = useCallback(async (
    id: string,
    dadosAnteriores?: Record<string, unknown>
  ) => {
    await registrarLog({
      acao: 'excluir',
      entidade_id: id,
      descricao: `Exclusão de ${entidadePadrao}`,
      dados_anteriores: dadosAnteriores,
    });
  }, [registrarLog, entidadePadrao]);

  const aprovar = useCallback(async (
    id: string,
    descricao?: string
  ) => {
    await registrarLog({
      acao: 'aprovar',
      entidade_id: id,
      descricao: descricao || `Aprovação de ${entidadePadrao}`,
    });
  }, [registrarLog, entidadePadrao]);

  const rejeitar = useCallback(async (
    id: string,
    motivo?: string
  ) => {
    await registrarLog({
      acao: 'rejeitar',
      entidade_id: id,
      descricao: `Rejeição de ${entidadePadrao}`,
      dados_novos: motivo ? { motivo } : undefined,
    });
  }, [registrarLog, entidadePadrao]);

  const calcular = useCallback(async (
    id: string,
    resultado?: Record<string, unknown>
  ) => {
    await registrarLog({
      acao: 'calcular',
      entidade_id: id,
      descricao: `Cálculo de ${entidadePadrao}`,
      dados_novos: resultado,
    });
  }, [registrarLog, entidadePadrao]);

  const exportar = useCallback(async (
    detalhes?: Record<string, unknown>
  ) => {
    await registrarLog({
      acao: 'exportar',
      descricao: `Exportação de ${entidadePadrao}`,
      dados_novos: detalhes,
    });
  }, [registrarLog, entidadePadrao]);

  return {
    registrarCriacao,
    registrarAlteracao,
    registrarExclusao,
    aprovar,
    rejeitar,
    calcular,
    exportar,
    registrarLog,
  };
}

// Hooks pré-configurados para cada módulo
export const useAuditoriaColaboradores = () => useAuditoriaIntegration('colaborador');
export const useAuditoriaAdmissoes = () => useAuditoriaIntegration('admissao');
export const useAuditoriaDesligamentos = () => useAuditoriaIntegration('desligamento');
export const useAuditoriaFerias = () => useAuditoriaIntegration('ferias');
export const useAuditoriaPonto = () => useAuditoriaIntegration('ponto');
export const useAuditoriaFolha = () => useAuditoriaIntegration('folha');
export const useAuditoriaBeneficios = () => useAuditoriaIntegration('beneficio');
export const useAuditoriaAfastamentos = () => useAuditoriaIntegration('afastamento');

export default useAuditoriaIntegration;



