import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuditoriaIntegration } from './useAuditoriaIntegration';
import { addDays, differenceInDays, parseISO, isAfter, isBefore, format, addYears, startOfDay } from 'date-fns';

export type StatusFeriasMelhorado = 'agendada' | 'em_andamento' | 'concluida' | 'cancelada' | 'aguardando_aprovacao' | 'aprovada' | 'rejeitada';
export type TipoFerias = 'integral' | 'parcial_20' | 'parcial_15' | 'parcial_10' | 'abono';

export interface PeriodoAquisitivoMelhorado {
  id: string;
  colaborador_id: string;
  data_inicio: string;
  data_fim: string;
  dias_direito: number;
  dias_descontados?: number;
  faltas_periodo?: number;
  numero_periodo?: number;
  status: string;
}

export interface FeriasMelhorado {
  id: string;
  colaborador_id: string;
  periodo_aquisitivo_id?: string | null;
  data_inicio: string;
  data_fim: string;
  dias_gozo: number;
  dias_abono?: number | null;
  vender_abono?: boolean | null;
  salario_base: number;
  valor_ferias: number;
  valor_terco: number;
  valor_abono?: number | null;
  valor_terco_abono?: number | null;
  valor_total: number;
  valor_liquido: number;
  descontos_inss?: number | null;
  descontos_irrf?: number | null;
  status: string;
  observacoes?: string | null;
  aprovado_por?: string | null;
  aprovado_em?: string | null;
  data_pagamento?: string | null;
  created_at?: string;
  created_by?: string | null;
  updated_at?: string;
  empresa_id?: string | null;
}

export interface FeriasComColaboradorMelhorado extends FeriasMelhorado {
  colaborador?: {
    id: string;
    nome_completo: string;
    cargo?: string;
    departamento?: string;
    salario_base?: number;
  } | null;
}

export interface CalculoFeriasMelhorado {
  salario_base: number;
  dias_ferias: number;
  dias_abono: number;
  valor_ferias: number;
  valor_terco: number;
  valor_abono: number;
  valor_terco_abono: number;
  adiantamento_13: number;
  total_bruto: number;
  inss: number;
  irrf: number;
  total_liquido: number;
}

const statusLabels: Record<string, string> = {
  agendada: 'Agendada',
  em_andamento: 'Em Andamento',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
  aguardando_aprovacao: 'Aguardando Aprovação',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
  programada: 'Programada',
  em_gozo: 'Em Gozo'
};

const tipoLabels: Record<TipoFerias, string> = {
  integral: '30 dias',
  parcial_20: '20 dias',
  parcial_15: '15 dias',
  parcial_10: '10 dias',
  abono: 'Abono pecuniário'
};

export function useFeriasMelhorado() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const auditoria = useAuditoriaIntegration('ferias');

  // Query para buscar todas as férias
  const feriasQuery = useQuery({
    queryKey: ['ferias-melhorado'],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ferias')
        .select(`
          *,
          colaborador:colaboradores(id, nome_completo, cargo, departamento, salario_base)
        `)
        .order('data_inicio', { ascending: false });

      if (error) throw error;
      return (data || []) as FeriasComColaboradorMelhorado[];
    }
  });

  // Query para períodos aquisitivos
  const periodosQuery = useQuery({
    queryKey: ['periodos-aquisitivos'],
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('periodos_aquisitivos')
        .select('*')
        .order('data_inicio', { ascending: false });

      if (error) throw error;
      return (data || []) as PeriodoAquisitivoMelhorado[];
    }
  });

  // Mutation para criar férias
  const criarFerias = useMutation({
    mutationFn: async (ferias: Omit<FeriasMelhorado, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('ferias')
        .insert({
          colaborador_id: ferias.colaborador_id,
          periodo_aquisitivo_id: ferias.periodo_aquisitivo_id,
          data_inicio: ferias.data_inicio,
          data_fim: ferias.data_fim,
          dias_gozo: ferias.dias_gozo,
          dias_abono: ferias.dias_abono || 0,
          vender_abono: ferias.vender_abono || false,
          salario_base: ferias.salario_base,
          valor_ferias: ferias.valor_ferias,
          valor_terco: ferias.valor_terco,
          valor_abono: ferias.valor_abono || 0,
          valor_terco_abono: ferias.valor_terco_abono || 0,
          valor_total: ferias.valor_total,
          valor_liquido: ferias.valor_liquido,
          descontos_inss: ferias.descontos_inss || 0,
          descontos_irrf: ferias.descontos_irrf || 0,
          status: ferias.status || 'programada',
          observacoes: ferias.observacoes,
        })
        .select()
        .single();

      if (error) throw error;
      
      // ✅ AUDITORIA
      await auditoria.registrarCriacao(data.id, {
        colaborador_id: ferias.colaborador_id,
        data_inicio: ferias.data_inicio,
        data_fim: ferias.data_fim,
        dias_gozo: ferias.dias_gozo
      });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferias-melhorado'] });
      queryClient.invalidateQueries({ queryKey: ['periodos-aquisitivos'] });
      toast({ title: 'Férias agendadas com sucesso!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao agendar férias', description: error.message, variant: 'destructive' });
    }
  });

  // Mutation para atualizar férias
  const atualizarFerias = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FeriasMelhorado> & { id: string }) => {
      const { data, error } = await supabase
        .from('ferias')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // ✅ AUDITORIA
      await auditoria.registrarAlteracao(id, undefined, updates);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferias-melhorado'] });
      toast({ title: 'Férias atualizadas com sucesso!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao atualizar férias', description: error.message, variant: 'destructive' });
    }
  });

  // Mutation para aprovar férias
  const aprovarFerias = useMutation({
    mutationFn: async ({ id, aprovadoPor }: { id: string; aprovadoPor: string }) => {
      const { data, error } = await supabase
        .from('ferias')
        .update({
          status: 'aprovada',
          aprovado_por: aprovadoPor,
          aprovado_em: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // ✅ AUDITORIA
      await auditoria.registrarAlteracao(id, undefined, {
        acao: 'aprovacao',
        aprovado_por: aprovadoPor,
        status: 'aprovada'
      });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferias-melhorado'] });
      toast({ title: 'Férias aprovadas com sucesso!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao aprovar férias', description: error.message, variant: 'destructive' });
    }
  });

  // Mutation para rejeitar férias
  const rejeitarFerias = useMutation({
    mutationFn: async ({ id, motivo }: { id: string; motivo?: string }) => {
      const { data, error } = await supabase
        .from('ferias')
        .update({
          status: 'cancelada',
          observacoes: motivo
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // ✅ AUDITORIA
      await auditoria.registrarAlteracao(id, undefined, {
        acao: 'rejeicao',
        motivo: motivo,
        status: 'rejeitada'
      });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferias-melhorado'] });
      toast({ title: 'Férias rejeitadas' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao rejeitar férias', description: error.message, variant: 'destructive' });
    }
  });

  // Mutation para cancelar férias
  const cancelarFerias = useMutation({
    mutationFn: async ({ id, motivo }: { id: string; motivo?: string }) => {
      const { data, error } = await supabase
        .from('ferias')
        .update({
          status: 'cancelada',
          observacoes: motivo
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // ✅ AUDITORIA
      await auditoria.registrarAlteracao(id, undefined, {
        acao: 'cancelamento',
        motivo: motivo,
        status: 'cancelada'
      });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferias-melhorado'] });
      queryClient.invalidateQueries({ queryKey: ['periodos-aquisitivos'] });
      toast({ title: 'Férias canceladas' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao cancelar férias', description: error.message, variant: 'destructive' });
    }
  });

  // Mutation para criar período aquisitivo
  const criarPeriodoAquisitivo = useMutation({
    mutationFn: async (periodo: Omit<PeriodoAquisitivoMelhorado, 'id'>) => {
      const { data, error } = await supabase
        .from('periodos_aquisitivos')
        .insert({
          colaborador_id: periodo.colaborador_id,
          data_inicio: periodo.data_inicio,
          data_fim: periodo.data_fim,
          dias_direito: periodo.dias_direito,
          dias_descontados: periodo.dias_descontados || 0,
          faltas_periodo: periodo.faltas_periodo || 0,
          numero_periodo: periodo.numero_periodo || 1,
          status: periodo.status || 'em_aquisicao',
        })
        .select()
        .single();

      if (error) throw error;
      
      // ✅ AUDITORIA
      await auditoria.registrarCriacao(data.id, {
        colaborador_id: periodo.colaborador_id,
        data_inicio: periodo.data_inicio,
        data_fim: periodo.data_fim,
        dias_direito: periodo.dias_direito
      });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['periodos-aquisitivos'] });
      toast({ title: 'Período aquisitivo criado!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao criar período', description: error.message, variant: 'destructive' });
    }
  });

  // Função para calcular férias
  const calcularFerias = useCallback((
    salarioBase: number,
    diasFerias: number,
    diasAbono: number = 0,
    adiantamento13: boolean = false
  ): CalculoFeriasMelhorado => {
    const salarioDia = salarioBase / 30;
    
    // Valor das férias
    const valorFerias = salarioDia * diasFerias;
    const valorTerco = valorFerias / 3;
    
    // Abono pecuniário
    const valorAbono = salarioDia * diasAbono;
    const valorTercoAbono = valorAbono / 3;
    
    // Adiantamento 13º (50%)
    const adiant13 = adiantamento13 ? salarioBase / 2 : 0;
    
    // Total bruto
    const totalBruto = valorFerias + valorTerco + valorAbono + valorTercoAbono + adiant13;
    
    // Cálculo INSS (simplificado - tabela 2025)
    let inss = 0;
    const baseINSS = valorFerias + valorTerco;
    if (baseINSS <= 1518) inss = baseINSS * 0.075;
    else if (baseINSS <= 2793.88) inss = baseINSS * 0.09;
    else if (baseINSS <= 4190.83) inss = baseINSS * 0.12;
    else inss = baseINSS * 0.14;
    inss = Math.min(inss, 876.95);
    
    // Cálculo IRRF (simplificado)
    const baseIRRF = baseINSS - inss;
    let irrf = 0;
    if (baseIRRF > 4664.68) irrf = baseIRRF * 0.275 - 896.00;
    else if (baseIRRF > 3751.05) irrf = baseIRRF * 0.225 - 662.77;
    else if (baseIRRF > 2826.65) irrf = baseIRRF * 0.15 - 381.44;
    else if (baseIRRF > 2259.20) irrf = baseIRRF * 0.075 - 169.44;
    irrf = Math.max(0, irrf);
    
    return {
      salario_base: salarioBase,
      dias_ferias: diasFerias,
      dias_abono: diasAbono,
      valor_ferias: valorFerias,
      valor_terco: valorTerco,
      valor_abono: valorAbono,
      valor_terco_abono: valorTercoAbono,
      adiantamento_13: adiant13,
      total_bruto: totalBruto,
      inss,
      irrf,
      total_liquido: totalBruto - inss - irrf
    };
  }, []);

  // Buscar férias de um colaborador específico
  const getFeriasColaborador = useCallback((colaboradorId: string) => {
    return feriasQuery.data?.filter(f => f.colaborador_id === colaboradorId) || [];
  }, [feriasQuery.data]);

  // Buscar períodos aquisitivos de um colaborador
  const getPeriodosColaborador = useCallback((colaboradorId: string) => {
    return periodosQuery.data?.filter(p => p.colaborador_id === colaboradorId) || [];
  }, [periodosQuery.data]);

  // Verificar se há conflito de datas
  const verificarConflitoFerias = useCallback((
    colaboradorId: string,
    dataInicio: string,
    dataFim: string,
    excluirId?: string
  ): boolean => {
    const feriasColaborador = getFeriasColaborador(colaboradorId);
    const inicio = parseISO(dataInicio);
    const fim = parseISO(dataFim);
    
    return feriasColaborador.some(f => {
      if (f.id === excluirId) return false;
      if (f.status === 'cancelada' || f.status === 'rejeitada') return false;
      
      const fInicio = parseISO(f.data_inicio);
      const fFim = parseISO(f.data_fim);
      
      return !(isAfter(inicio, fFim) || isBefore(fim, fInicio));
    });
  }, [getFeriasColaborador]);

  // Estatísticas
  const estatisticas = useMemo(() => {
    const ferias = feriasQuery.data || [];
    const hoje = startOfDay(new Date());
    
    return {
      total: ferias.length,
      aguardandoAprovacao: ferias.filter(f => f.status === 'aguardando_aprovacao').length,
      aprovadas: ferias.filter(f => f.status === 'aprovada').length,
      emAndamento: ferias.filter(f => f.status === 'em_andamento').length,
      agendadas: ferias.filter(f => f.status === 'agendada').length,
      proximoMes: ferias.filter(f => {
        const inicio = parseISO(f.data_inicio);
        const em30Dias = addDays(hoje, 30);
        return isAfter(inicio, hoje) && isBefore(inicio, em30Dias);
      }).length
    };
  }, [feriasQuery.data]);

  return {
    // Dados
    ferias: feriasQuery.data || [],
    periodos: periodosQuery.data || [],
    estatisticas,
    
    // Estados
    isLoading: feriasQuery.isLoading || periodosQuery.isLoading,
    error: feriasQuery.error || periodosQuery.error,
    
    // Mutations
    criarFerias,
    atualizarFerias,
    aprovarFerias,
    rejeitarFerias,
    cancelarFerias,
    criarPeriodoAquisitivo,
    
    // Funções auxiliares
    calcularFerias,
    getFeriasColaborador,
    getPeriodosColaborador,
    verificarConflitoFerias,
    
    // Labels
    statusLabels,
    tipoLabels,
    
    // Refetch
    refetch: () => {
      feriasQuery.refetch();
      periodosQuery.refetch();
    }
  };
}




