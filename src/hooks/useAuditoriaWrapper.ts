import { useCallback } from 'react';
import { useAuditoria, TipoAcao, Entidade } from './useAuditoria';

/**
 * Hook wrapper para facilitar o registro de auditoria
 * Uso: const { registrar } = useAuditoriaWrapper('colaborador');
 *      registrar('criar', colaboradorId, 'Criou colaborador João');
 */
export function useAuditoriaWrapper(entidade: Entidade) {
  const { registrarLog, registrarCriacao, registrarEdicao, registrarExclusao } = useAuditoria();

  const registrar = useCallback(async (
    acao: TipoAcao,
    entidadeId: string,
    descricao: string,
    dadosAnteriores?: Record<string, any>,
    dadosNovos?: Record<string, any>
  ) => {
    await registrarLog({
      acao,
      entidade,
      entidade_id: entidadeId,
      descricao,
      dados_anteriores: dadosAnteriores,
      dados_novos: dadosNovos,
    });
  }, [entidade, registrarLog]);

  const criar = useCallback(async (
    entidadeId: string,
    descricao: string,
    dados?: Record<string, any>
  ) => {
    await registrarCriacao(entidade, entidadeId, descricao, dados);
  }, [entidade, registrarCriacao]);

  const editar = useCallback(async (
    entidadeId: string,
    descricao: string,
    dadosAnteriores?: Record<string, any>,
    dadosNovos?: Record<string, any>
  ) => {
    await registrarEdicao(entidade, entidadeId, descricao, dadosAnteriores, dadosNovos);
  }, [entidade, registrarEdicao]);

  const excluir = useCallback(async (
    entidadeId: string,
    descricao: string,
    dadosAnteriores?: Record<string, any>
  ) => {
    await registrarExclusao(entidade, entidadeId, descricao, dadosAnteriores);
  }, [entidade, registrarExclusao]);

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
