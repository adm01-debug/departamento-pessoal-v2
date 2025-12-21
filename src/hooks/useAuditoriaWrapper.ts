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
export function useAuditoriaWrapper(entidade: Entidade) {
  const auditoria = useAuditoriaIntegration(entidade as EntidadeAuditoria);

  const registrar = useCallback(async (
    acao: TipoAcao,
    entidadeId: string,
    descricao: string,
    dadosAnteriores?: Record<string, any>,
    dadosNovos?: Record<string, any>
  ) => {
    await auditoria.registrarLog({
      acao: acao as any,
      entidade_id: entidadeId,
      descricao,
      dados_anteriores: dadosAnteriores,
      dados_novos: dadosNovos,
    });
  }, [auditoria]);

  const criar = useCallback(async (
    entidadeId: string,
    descricao: string,
    dados?: Record<string, any>
  ) => {
    await auditoria.registrarCriacao(entidadeId, dados);
  }, [auditoria]);

  const editar = useCallback(async (
    entidadeId: string,
    descricao: string,
    dadosAnteriores?: Record<string, any>,
    dadosNovos?: Record<string, any>
  ) => {
    await auditoria.registrarAlteracao(entidadeId, dadosAnteriores, dadosNovos);
  }, [auditoria]);

  const excluir = useCallback(async (
    entidadeId: string,
    descricao: string,
    dadosAnteriores?: Record<string, any>
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
