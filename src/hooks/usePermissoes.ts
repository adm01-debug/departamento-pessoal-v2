/**
 * @fileoverview Hook para permissões
 * @module hooks/usePermissoes
 */
import { useMemo } from 'react';
import { useAuth } from './useAuth';

export type Permissao = 
  | 'colaboradores.ver' | 'colaboradores.criar' | 'colaboradores.editar' | 'colaboradores.excluir'
  | 'folha.ver' | 'folha.processar' | 'folha.aprovar'
  | 'ferias.ver' | 'ferias.aprovar'
  | 'relatorios.ver' | 'relatorios.exportar'
  | 'configuracoes.ver' | 'configuracoes.editar'
  | 'usuarios.ver' | 'usuarios.gerenciar';

const PERMISSOES_POR_CARGO: Record<string, Permissao[]> = {
  admin: ['colaboradores.ver', 'colaboradores.criar', 'colaboradores.editar', 'colaboradores.excluir',
          'folha.ver', 'folha.processar', 'folha.aprovar',
          'ferias.ver', 'ferias.aprovar',
          'relatorios.ver', 'relatorios.exportar',
          'configuracoes.ver', 'configuracoes.editar',
          'usuarios.ver', 'usuarios.gerenciar'],
  gerente: ['colaboradores.ver', 'colaboradores.criar', 'colaboradores.editar',
            'folha.ver', 'ferias.ver', 'ferias.aprovar', 'relatorios.ver'],
  analista: ['colaboradores.ver', 'folha.ver', 'ferias.ver', 'relatorios.ver'],
  visualizador: ['colaboradores.ver', 'folha.ver', 'ferias.ver'],
};

export function usePermissoes() {
  const { profile } = useAuth();
  
  const permissoes = useMemo(() => {
    const cargo = profile?.cargo?.toLowerCase() || 'visualizador';
    return PERMISSOES_POR_CARGO[cargo] || PERMISSOES_POR_CARGO.visualizador;
  }, [profile?.cargo]);

  const temPermissao = (permissao: Permissao) => permissoes.includes(permissao);
  const temAlgumaPermissao = (lista: Permissao[]) => lista.some(p => permissoes.includes(p));
  const temTodasPermissoes = (lista: Permissao[]) => lista.every(p => permissoes.includes(p));

  return { permissoes, temPermissao, temAlgumaPermissao, temTodasPermissoes };
}

export default usePermissoes;
