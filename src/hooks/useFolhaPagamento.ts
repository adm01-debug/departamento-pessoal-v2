/**
 * @fileoverview Hook para gerenciamento de folha de pagamento
 * @module hooks/useFolhaPagamento
 * @version V8.1 - Corrigido por análise QA
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { 
  FolhaPagamento, 
  Holerite, 
  RubricaFolha, 
  StatusFolha,
  TotaisFolha,
} from '@/types/folha';
import { Colaborador } from '@/types/colaborador';
import { 
  calcularINSS, 
  calcularIRRF, 
  calcularFGTS, 
  calcularINSSPatronal,
  arredondarMonetario,
} from '@/lib/calculosTrabalhistas';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';
import { useEmpresas } from './useEmpresas';

// ============================================
// TIPOS
// ============================================

export interface UseFolhasPagamentoReturn {
  folhas: FolhaPagamento[];
  loading: boolean;
  error: Error | null;
  fetchFolhas: () => Promise<void>;
  createFolha: (competencia: string) => Promise<FolhaPagamento | null>;
  updateFolhaStatus: (id: string, status: StatusFolha) => Promise<FolhaPagamento | null>;
  deleteFolha: (id: string) => Promise<boolean>;
  calcularFolha: (id: string) => Promise<boolean>;
}

export interface UseHoleritesReturn {
  holerites: Holerite[];
  loading: boolean;
  error: Error | null;
  totais: TotaisFolha | null;
  fetchHolerites: () => Promise<void>;
  gerarHolerite: (colaboradorId: string, competencia: string) => Promise<Holerite | null>;
  recalcularHolerite: (id: string) => Promise<Holerite | null>;
}

// ============================================
// UTILIDADES
// ============================================

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Erro desconhecido';
}

function formatCompetencia(competencia: string): { mes: number; ano: number } {
  const [ano, mes] = competencia.split('-').map(Number);
  return { mes, ano };
}

// ============================================
// HOOK: useFolhasPagamento
// ============================================

export function useFolhasPagamento(): UseFolhasPagamentoReturn {
  const [folhas, setFolhas] = useState<FolhaPagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { empresaAtualId } = useEmpresas();

  const fetchFolhas = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('folhas_pagamento')
        .select('*')
        .order('competencia', { ascending: false });

      if (empresaAtualId) {
        query = query.eq('empresa_id', empresaAtualId);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw new Error(queryError.message);
      setFolhas((data || []) as FolhaPagamento[]);
    } catch (err) {
      const message = getErrorMessage(err);
      logger.error('Erro ao buscar folhas:', err);
      setError(err instanceof Error ? err : new Error(message));
      toast({ title: 'Erro', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [user, empresaAtualId]);

  useEffect(() => {
    fetchFolhas();
  }, [fetchFolhas]);

  const createFolha = useCallback(async (competencia: string): Promise<FolhaPagamento | null> => {
    if (!user || !empresaAtualId) {
      toast({ title: 'Erro', description: 'Usuário ou empresa não identificados', variant: 'destructive' });
      return null;
    }

    try {
      const { mes, ano } = formatCompetencia(competencia);
      
      // Verificar se já existe folha para esta competência
      const { data: existente } = await supabase
        .from('folhas_pagamento')
        .select('id')
        .eq('empresa_id', empresaAtualId)
        .eq('competencia', competencia)
        .maybeSingle();
      
      if (existente) {
        toast({ title: 'Atenção', description: 'Já existe uma folha para esta competência', variant: 'destructive' });
        return null;
      }

      const novaFolha = {
        competencia,
        mes,
        ano,
        empresa_id: empresaAtualId,
        status: 'aberta' as StatusFolha,
        total_colaboradores: 0,
        total_proventos: 0,
        total_descontos: 0,
        total_liquido: 0,
        total_fgts: 0,
        total_inss_patronal: 0,
        custo_total: 0,
        data_abertura: new Date().toISOString(),
        created_by: user.id,
      };

      const { data, error: insertError } = await supabase
        .from('folhas_pagamento')
        .insert([novaFolha])
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);
      
      const folhaCriada = data as FolhaPagamento;
      setFolhas(prev => [folhaCriada, ...prev]);
      toast({ title: 'Sucesso!', description: `Folha ${competencia} criada` });
      return folhaCriada;
    } catch (err) {
      const message = getErrorMessage(err);
      logger.error('Erro ao criar folha:', err);
      toast({ title: 'Erro', description: message, variant: 'destructive' });
      return null;
    }
  }, [user, empresaAtualId]);

  const updateFolhaStatus = useCallback(async (id: string, status: StatusFolha): Promise<FolhaPagamento | null> => {
    try {
      const updateData: Partial<FolhaPagamento> = { 
        status,
        updated_at: new Date().toISOString(),
      };
      
      if (status === 'calculada') {
        updateData.data_calculo = new Date().toISOString();
      }
      if (status === 'fechada') {
        updateData.data_fechamento = new Date().toISOString();
      }
      if (status === 'paga') {
        updateData.data_pagamento = new Date().toISOString();
      }

      const { data, error: updateError } = await supabase
        .from('folhas_pagamento')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw new Error(updateError.message);
      
      const folhaAtualizada = data as FolhaPagamento;
      setFolhas(prev => prev.map(f => f.id === id ? folhaAtualizada : f));
      toast({ title: 'Sucesso!', description: `Status atualizado para ${status}` });
      return folhaAtualizada;
    } catch (err) {
      const message = getErrorMessage(err);
      logger.error('Erro ao atualizar status:', err);
      toast({ title: 'Erro', description: message, variant: 'destructive' });
      return null;
    }
  }, []);

  const deleteFolha = useCallback(async (id: string): Promise<boolean> => {
    try {
      // Verificar se pode excluir (apenas folhas abertas)
      const folha = folhas.find(f => f.id === id);
      if (folha && folha.status !== 'aberta') {
        toast({ title: 'Erro', description: 'Apenas folhas abertas podem ser excluídas', variant: 'destructive' });
        return false;
      }

      const { error: deleteError } = await supabase
        .from('folhas_pagamento')
        .delete()
        .eq('id', id);

      if (deleteError) throw new Error(deleteError.message);
      
      setFolhas(prev => prev.filter(f => f.id !== id));
      toast({ title: 'Sucesso!', description: 'Folha excluída' });
      return true;
    } catch (err) {
      const message = getErrorMessage(err);
      logger.error('Erro ao excluir folha:', err);
      toast({ title: 'Erro', description: message, variant: 'destructive' });
      return false;
    }
  }, [folhas]);

  const calcularFolha = useCallback(async (id: string): Promise<boolean> => {
    try {
      // Buscar colaboradores ativos
      const { data: colaboradores, error: colabError } = await supabase
        .from('colaboradores')
        .select('*')
        .eq('empresa_id', empresaAtualId)
        .eq('status', 'ativo');

      if (colabError) throw new Error(colabError.message);
      if (!colaboradores?.length) {
        toast({ title: 'Atenção', description: 'Nenhum colaborador ativo encontrado' });
        return false;
      }

      // Calcular cada colaborador
      let totalProventos = 0;
      let totalDescontos = 0;
      let totalLiquido = 0;
      let totalFGTS = 0;
      let totalINSSPatronal = 0;

      for (const colab of colaboradores) {
        const salario = colab.salario || colab.salario_base || 0;
        const inss = calcularINSS(salario);
        const irrf = calcularIRRF(salario, inss.valorINSS, 0);
        const fgts = calcularFGTS(salario);
        const inssPatronal = calcularINSSPatronal(salario);

        totalProventos += salario;
        totalDescontos += inss.valorINSS + irrf.valorIRRF;
        totalLiquido += salario - inss.valorINSS - irrf.valorIRRF;
        totalFGTS += fgts;
        totalINSSPatronal += inssPatronal;
      }

      // Atualizar folha
      const { error: updateError } = await supabase
        .from('folhas_pagamento')
        .update({
          status: 'calculada',
          total_colaboradores: colaboradores.length,
          total_proventos: arredondarMonetario(totalProventos),
          total_descontos: arredondarMonetario(totalDescontos),
          total_liquido: arredondarMonetario(totalLiquido),
          total_fgts: arredondarMonetario(totalFGTS),
          total_inss_patronal: arredondarMonetario(totalINSSPatronal),
          custo_total: arredondarMonetario(totalProventos + totalFGTS + totalINSSPatronal),
          data_calculo: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw new Error(updateError.message);
      
      await fetchFolhas();
      toast({ title: 'Sucesso!', description: `Folha calculada: ${colaboradores.length} colaboradores` });
      return true;
    } catch (err) {
      const message = getErrorMessage(err);
      logger.error('Erro ao calcular folha:', err);
      toast({ title: 'Erro', description: message, variant: 'destructive' });
      return false;
    }
  }, [empresaAtualId, fetchFolhas]);

  return { 
    folhas, 
    loading, 
    error, 
    fetchFolhas, 
    createFolha, 
    updateFolhaStatus, 
    deleteFolha,
    calcularFolha,
  };
}

// ============================================
// HOOK: useRubricas
// ============================================

export function useRubricas() {
  const [rubricas, setRubricas] = useState<RubricaFolha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRubricas = async () => {
      try {
        setLoading(true);
        const { data, error: queryError } = await supabase
          .from('rubricas_folha')
          .select('*')
          .eq('ativa', true)
          .order('codigo');

        if (queryError) throw new Error(queryError.message);
        setRubricas((data || []) as RubricaFolha[]);
      } catch (err) {
        logger.error('Erro ao buscar rubricas:', err);
        setError(err instanceof Error ? err : new Error(getErrorMessage(err)));
      } finally {
        setLoading(false);
      }
    };
    
    fetchRubricas();
  }, []);

  const rubricasProventos = useMemo(() => 
    rubricas.filter(r => r.tipo === 'provento'), [rubricas]);
  
  const rubricasDescontos = useMemo(() => 
    rubricas.filter(r => r.tipo === 'desconto'), [rubricas]);

  return { rubricas, rubricasProventos, rubricasDescontos, loading, error };
}

// ============================================
// HOOK: useHolerites
// ============================================

export function useHolerites(folhaId?: string, competencia?: string): UseHoleritesReturn {
  const [holerites, setHolerites] = useState<Holerite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { empresaAtualId } = useEmpresas();

  const fetchHolerites = useCallback(async () => {
    if (!folhaId && !competencia) return;
    
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('holerites')
        .select('*')
        .order('colaborador_nome');

      if (folhaId) {
        query = query.eq('folha_id', folhaId);
      }
      if (competencia) {
        query = query.eq('competencia', competencia);
      }
      if (empresaAtualId) {
        query = query.eq('empresa_id', empresaAtualId);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw new Error(queryError.message);
      setHolerites((data || []) as Holerite[]);
    } catch (err) {
      logger.error('Erro ao buscar holerites:', err);
      setError(err instanceof Error ? err : new Error(getErrorMessage(err)));
    } finally {
      setLoading(false);
    }
  }, [folhaId, competencia, empresaAtualId]);

  useEffect(() => {
    fetchHolerites();
  }, [fetchHolerites]);

  const totais = useMemo((): TotaisFolha | null => {
    if (!holerites.length) return null;
    
    return {
      totalColaboradores: holerites.length,
      totalProventos: holerites.reduce((acc, h) => acc + h.total_proventos, 0),
      totalDescontos: holerites.reduce((acc, h) => acc + h.total_descontos, 0),
      totalLiquido: holerites.reduce((acc, h) => acc + h.salario_liquido, 0),
      totalINSS: holerites.reduce((acc, h) => acc + (h.inss || 0), 0),
      totalIRRF: holerites.reduce((acc, h) => acc + (h.irrf || 0), 0),
      totalFGTS: holerites.reduce((acc, h) => acc + (h.fgts || 0), 0),
      totalINSSPatronal: holerites.reduce((acc, h) => acc + (h.inss_patronal || 0), 0),
      custoTotal: holerites.reduce((acc, h) => 
        acc + h.total_proventos + (h.fgts || 0) + (h.inss_patronal || 0), 0),
    };
  }, [holerites]);

  const gerarHolerite = useCallback(async (
    colaboradorId: string, 
    comp: string
  ): Promise<Holerite | null> => {
    // Implementação futura
    logger.info('gerarHolerite chamado:', { colaboradorId, comp });
    return null;
  }, []);

  const recalcularHolerite = useCallback(async (id: string): Promise<Holerite | null> => {
    // Implementação futura
    logger.info('recalcularHolerite chamado:', { id });
    return null;
  }, []);

  return { 
    holerites, 
    loading, 
    error, 
    totais, 
    fetchHolerites, 
    gerarHolerite, 
    recalcularHolerite 
  };
}

// ============================================
// EXPORTS DEFAULT
// ============================================

export default useFolhasPagamento;
