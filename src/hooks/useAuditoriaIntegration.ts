import { useCallback } from 'react';
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
  | 'bitrix24';

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
  dados_anteriores?: Record<string, any>;
  dados_novos?: Record<string, any>;
}

/**
 * Hook simplificado para integração de auditoria
 * Uso: const { audit } = useAuditoriaIntegration('colaborador');
 *      await audit.criar(id, 'Criou colaborador João', { nome: 'João' });
 */
export function useAuditoriaIntegration(entidade: EntidadeAuditoria) {
  const { user } = useAuth();

  const registrarLog = useCallback(async (log: Omit<LogAuditoria, 'entidade'>) => {
    try {
      await supabase.from('auditoria_logs').insert({
        acao: log.acao,
        entidade,
        entidade_id: log.entidade_id,
        descricao: log.descricao,
        dados_anteriores: log.dados_anteriores,
        dados_novos: log.dados_novos,
        user_id: user?.id,
        user_email: user?.email,
      });
    } catch (error) {
      console.error('Erro ao registrar auditoria:', error);
    }
  }, [entidade, user]);

  const criar = useCallback(async (
    id: string,
    descricao: string,
    dados?: Record<string, any>
  ) => {
    await registrarLog({
      acao: 'criar',
      entidade_id: id,
      descricao,
      dados_novos: dados,
    });
  }, [registrarLog]);

  const editar = useCallback(async (
    id: string,
    descricao: string,
    dadosAnteriores?: Record<string, any>,
    dadosNovos?: Record<string, any>
  ) => {
    await registrarLog({
      acao: 'editar',
      entidade_id: id,
      descricao,
      dados_anteriores: dadosAnteriores,
      dados_novos: dadosNovos,
    });
  }, [registrarLog]);

  const excluir = useCallback(async (
    id: string,
    descricao: string,
    dadosAnteriores?: Record<string, any>
  ) => {
    await registrarLog({
      acao: 'excluir',
      entidade_id: id,
      descricao,
      dados_anteriores: dadosAnteriores,
    });
  }, [registrarLog]);

  const aprovar = useCallback(async (
    id: string,
    descricao: string
  ) => {
    await registrarLog({
      acao: 'aprovar',
      entidade_id: id,
      descricao,
    });
  }, [registrarLog]);

  const rejeitar = useCallback(async (
    id: string,
    descricao: string,
    motivo?: string
  ) => {
    await registrarLog({
      acao: 'rejeitar',
      entidade_id: id,
      descricao,
      dados_novos: motivo ? { motivo } : undefined,
    });
  }, [registrarLog]);

  const calcular = useCallback(async (
    id: string,
    descricao: string,
    resultado?: Record<string, any>
  ) => {
    await registrarLog({
      acao: 'calcular',
      entidade_id: id,
      descricao,
      dados_novos: resultado,
    });
  }, [registrarLog]);

  const exportar = useCallback(async (
    descricao: string,
    detalhes?: Record<string, any>
  ) => {
    await registrarLog({
      acao: 'exportar',
      descricao,
      dados_novos: detalhes,
    });
  }, [registrarLog]);

  return {
    criar,
    editar,
    excluir,
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
