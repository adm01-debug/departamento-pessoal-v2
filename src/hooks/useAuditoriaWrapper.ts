import { useCallback } from 'react';
import { useAuditoriaIntegration, EntidadeAuditoria } from './useAuditoriaIntegration';

export type Entidade = 
  | 'colaborador' 
  | 'admissao' 
  | 'desligamento' 
  | 'ferias' 
  | 'afastamento' 
  | 'ponto' 
  | 'folha' 
  | 'empresa'
  | 'beneficio';

export type TipoAcao = 
  | 'criar' 
  | 'editar' 
  | 'excluir' 
  | 'visualizar' 
  | 'exportar' 
  | 'importar' 
  | 'aprovar' 
  | 'rejeitar' 
  | 'login' 
  | 'logout' 
  | 'sync';

/**
 * Hook wrapper para facilitar o registro de auditoria
 * Uso: const { registrar } = useAuditoriaWrapper('colaborador');
 *      registrar('criar', colaboradorId, 'Criou colaborador João');
 */
export interface UseAuditoriaWrapperReturn {
  registrar: (acao: Acao, entidadeId: string, descricao: string, dados?: Record<string, unknown>) => Promise<void>;
  criar: (entidadeId: string, descricao: string, dados?: Record<string, unknown>) => Promise<void>;
  editar: (entidadeId: string, descricao: string, dadosAnteriores?: Record<string, unknown>, dadosNovos?: Record<string, unknown>) => Promise<void>;
  excluir: (entidadeId: string, descricao: string, dadosAnteriores?: Record<string, unknown>) => Promise<void>;
  entidade: Entidade;
}

export function useAuditoriaWrapper(entidade: Entidade): UseAuditoriaWrapperReturn {
  const auditoria = useAuditoriaIntegration(entidade as EntidadeAuditoria);

  const registrar = useCallback(async (
    acao: TipoAcao,
    entidadeId: string,
    descricao: string,
    dadosAnteriores?: Record<string, unknown>,
    dadosNovos?: Record<string, unknown>
  ) => {
    await auditoria.registrarLog({
      acao: acao as TipoAcao,
      entidade_id: entidadeId,
      descricao,
      dados_anteriores: dadosAnteriores,
      dados_novos: dadosNovos,
    });
  }, [auditoria]);

  const criar = useCallback(async (
    entidadeId: string,
    descricao: string,
    dados?: Record<string, unknown>
  ) => {
    await auditoria.registrarCriacao(entidadeId, dados);
  }, [auditoria]);

  const editar = useCallback(async (
    entidadeId: string,
    descricao: string,
    dadosAnteriores?: Record<string, unknown>,
    dadosNovos?: Record<string, unknown>
  ) => {
    await auditoria.registrarAlteracao(entidadeId, dadosAnteriores, dadosNovos);
  }, [auditoria]);

  const excluir = useCallback(async (
    entidadeId: string,
    descricao: string,
    dadosAnteriores?: Record<string, unknown>
  ) => {
    await auditoria.registrarExclusao(entidadeId, dadosAnteriores);
  }, [auditoria]);

  return {
    registrar,
    criar,
    editar,
    excluir,
    entidade,
  };
}

// Hooks pré-configurados para cada entidade
export const useAuditoriaColaborador = () => useAuditoriaWrapper('colaborador');
export const useAuditoriaAdmissao = () => useAuditoriaWrapper('admissao');
export const useAuditoriaDesligamento = () => useAuditoriaWrapper('desligamento');
export const useAuditoriaFerias = () => useAuditoriaWrapper('ferias');
export const useAuditoriaPonto = () => useAuditoriaWrapper('ponto');
export const useAuditoriaFolha = () => useAuditoriaWrapper('folha');
export const useAuditoriaBeneficio = () => useAuditoriaWrapper('beneficio');
export const useAuditoriaAfastamento = () => useAuditoriaWrapper('afastamento');

export default useAuditoriaWrapper;


