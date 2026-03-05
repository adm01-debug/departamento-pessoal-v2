// @ts-nocheck
/**
 * @fileoverview Hook para auditoria
 * @module hooks/useAuditoria
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Tipos exportados para uso em componentes
export type TipoAcao = 'criar' | 'editar' | 'excluir' | 'visualizar' | 'exportar' | 'importar' | 'aprovar' | 'rejeitar' | 'login' | 'logout' | 'sync';
export type Entidade = 'colaborador' | 'admissao' | 'desligamento' | 'ferias' | 'afastamento' | 'ponto' | 'folha' | 'empresa';

export interface AuditLog {
  id: string;
  tabela: string;
  registro_id: string;
  acao: 'INSERT' | 'UPDATE' | 'DELETE';
  dados_anteriores: Record<string, unknown> | null;
  dados_novos: Record<string, unknown> | null;
  campos_alterados: string[] | null;
  user_id: string | null;
  user_email: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  descricao?: string;
}

interface FiltrosAuditoria {
  tabela?: string;
  acao?: string;
  dataInicio?: string;
  dataFim?: string;
  userId?: string;
  registroId?: string;
}

const TABELA_LABELS: Record<string, string> = {
  colaboradores: 'Colaboradores',
  admissoes: 'Admissões',
  desligamentos: 'Desligamentos',
  ferias: 'Férias',
  afastamentos: 'Afastamentos',
  registros_ponto: 'Registros de Ponto',
  folhas_pagamento: 'Folhas de Pagamento',
  holerites: 'Holerites',
};

const ACAO_LABELS: Record<string, string> = {
  INSERT: 'Criação',
  UPDATE: 'Alteração',
  DELETE: 'Exclusão',
};

const ACAO_COLORS: Record<string, { bg: string; text: string }> = {
  INSERT: { bg: 'bg-success/10', text: 'text-success' },
  UPDATE: { bg: 'bg-warning/10', text: 'text-warning' },
  DELETE: { bg: 'bg-destructive/10', text: 'text-destructive' },
};

export function useAuditoria(filtros?: FiltrosAuditoria) {
  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ['audit_log', filtros],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    meta: { onError: (error: Error) => console.error('Erro ao carregar auditoria:', error) },
    queryFn: async () => {
      let query = supabase
        .from('audit_log')
        .select('id, acao, usuario_id, tabela, registro_id, dados_antigos, dados_novos, created_at')
        .order('created_at', { ascending: false ,
    staleTime: 5 * 60 * 1000,
    retry: 3})
        .limit(500);

      if (filtros?.tabela && filtros.tabela !== 'todas') {
        query = query.eq('tabela', filtros.tabela);
      }
      if (filtros?.acao && filtros.acao !== 'todas') {
        query = query.eq('acao', filtros.acao);
      }
      if (filtros?.dataInicio) {
        query = query.gte('created_at', filtros.dataInicio);
      }
      if (filtros?.dataFim) {
        query = query.lte('created_at', filtros.dataFim + 'T23:59:59');
      }
      if (filtros?.userId) {
        query = query.eq('user_id', filtros.userId);
      }
      if (filtros?.registroId) {
        query = query.eq('registro_id', filtros.registroId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as AuditLog[];
    },
  });

  // Estatísticas
  const estatisticas = {
    total: logs.length,
    porAcao: {
      INSERT: logs.filter(l => l.acao === 'INSERT').length,
      UPDATE: logs.filter(l => l.acao === 'UPDATE').length,
      DELETE: logs.filter(l => l.acao === 'DELETE').length,
    },
    porTabela: Object.keys(TABELA_LABELS).reduce((acc, tabela) => {
      acc[tabela] = logs.filter(l => l.tabela === tabela).length;
      return acc;
    }, {} as Record<string, number>),
  };

  return {
    logs,
    isLoading,
    refetch,
    estatisticas,
    TABELA_LABELS,
    ACAO_LABELS,
    ACAO_COLORS,
  };
}

// Hook para buscar histórico de um registro específico
export function useHistoricoRegistro(tabela: string, registroId: string) {
  return useQuery({
    queryKey: ['audit_log', 'registro', tabela, registroId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_log')
        .select('id, acao, usuario_id, tabela, registro_id, dados_antigos, dados_novos, created_at')
        .eq('tabela', tabela)
        .eq('registro_id', registroId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AuditLog[];
    },
    enabled: !!tabela && !!registroId,
  });
}









