/**
 * @fileoverview Hook para gerenciamento de férias
 * @module hooks/useFerias
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PeriodoAquisitivo, Ferias, CalculoFerias, StatusFerias } from '@/types/ferias';
import { calcularINSS, calcularIRRF } from '@/lib/calculosTrabalhistas';
import { addDays, differenceInDays, addYears, format, parseISO } from 'date-fns';
import { useEmpresas } from './useEmpresas';
import { useAuditoriaIntegration } from './useAuditoriaIntegration';

// Calcular dias de direito baseado em faltas (CLT Art. 130)
export const calcularDiasDireito = (faltas: number): number => {
  if (faltas <= 5) return 30;
  if (faltas <= 14) return 24;
  if (faltas <= 23) return 18;
  if (faltas <= 32) return 12;
  return 0; // Perde direito a férias
};

// Calcular valores de férias
export const calcularFerias = (
  salarioBase: number,
  diasGozo: number,
  diasAbono: number = 0,
  dependentesIRRF: number = 0
): CalculoFerias => {
  // Valor diário
  const valorDiario = salarioBase / 30;
  
  // Valor das férias (proporcional aos dias de gozo)
  const valorFerias = valorDiario * diasGozo;
  
  // 1/3 constitucional sobre férias
  const valorTerco = valorFerias / 3;
  
  // Abono pecuniário (máximo 10 dias / 1/3 do período)
  const valorAbono = valorDiario * diasAbono;
  const valorTercoAbono = valorAbono / 3;
  
  // Valor bruto total
  const valorBruto = valorFerias + valorTerco + valorAbono + valorTercoAbono;
  
  // Base para INSS (férias + 1/3, abono não incide INSS)
  const baseINSS = valorFerias + valorTerco;
  const resultadoINSS = calcularINSS(baseINSS);
  const descontoINSS = resultadoINSS.valorINSS;
  
  // Base para IRRF (tudo menos INSS)
  const baseIRRF = valorBruto;
  const resultadoIRRF = calcularIRRF(baseIRRF, descontoINSS, dependentesIRRF);
  const descontoIRRF = resultadoIRRF.valorIRRF;
  
  // Valor líquido
  const valorLiquido = valorBruto - descontoINSS - descontoIRRF;
  
  return {
    salarioBase,
    diasGozo,
    diasAbono,
    valorFerias,
    valorTerco,
    valorAbono,
    valorTercoAbono,
    valorBruto,
    descontoINSS,
    descontoIRRF,
    valorLiquido
  };
};

export interface UseFeriasReturn {
  usePeriodosAquisitivos: (colaboradorId?: string) => ReturnType<typeof useQuery>;
  useFeriasQuery: (filtros?: { colaboradorId?: string; status?: StatusFerias; ano?: number }) => ReturnType<typeof useQuery>;
  criarPeriodoAquisitivo: (periodo: Partial<PeriodoAquisitivo>) => void;
  gerarPeriodosAquisitivos: (colaboradorId: string, dataAdmissao: string) => void;
  programarFerias: (ferias: Partial<Ferias>) => void;
  aprovarFerias: (id: string) => void;
  cancelarFerias: (id: string) => void;
  calcularPeriodoConcessivo: (periodoAquisitivo: PeriodoAquisitivo) => { inicio: string; fim: string; diasRestantes: number };
  calcularFerias: typeof calcularFerias;
  calcularDiasDireito: typeof calcularDiasDireito;
  isProgramando: boolean;
  isAprovando: boolean;
}

export const useFerias = (): UseFeriasReturn => {
  const queryClient = useQueryClient();
  const { empresaAtualId } = useEmpresas();

  // Buscar períodos aquisitivos de um colaborador
  const usePeriodosAquisitivos = (colaboradorId: string | null) => {
    return useQuery({
      queryKey: ['periodos-aquisitivos', colaboradorId],
      queryFn: async () => {
        if (!colaboradorId) return [];
        const { data, error } = await supabase
          .from('periodos_aquisitivos')
          .select('id, colaborador_id, data_inicio, data_fim, dias_gozo, status, observacoes')
          .eq('colaborador_id', colaboradorId)
          .order('numero_periodo', { ascending: true });
        
        if (error) throw error;
        return data as PeriodoAquisitivo[];
      },
      enabled: !!colaboradorId
    });
  };

  // Buscar todas as férias (com filtros opcionais)
  const useFeriasQuery = (filtros?: { colaboradorId?: string; status?: StatusFerias; ano?: number }) => {
    return useQuery({
      queryKey: ['ferias', filtros, empresaAtualId],
      queryFn: async () => {
        let query = supabase
          .from('ferias')
          .select(`
            *,
            colaboradores!inner(nome_completo, cargo, departamento)
          `)
          .order('data_inicio', { ascending: true });
        
        if (empresaAtualId) {
          query = query.eq('empresa_id', empresaAtualId);
        }
        if (filtros?.colaboradorId) {
          query = query.eq('colaborador_id', filtros.colaboradorId);
        }
        if (filtros?.status) {
          query = query.eq('status', filtros.status);
        }
        if (filtros?.ano) {
          query = query.gte('data_inicio', `${filtros.ano}-01-01`)
                       .lte('data_inicio', `${filtros.ano}-12-31`);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        
        return (data ?? []).map((f: Record<string, unknown> & { colaboradores?: { nome_completo?: string; cargo?: string; departamento?: string } }) => ({
          ...f,
          colaborador_nome: f.colaboradores?.nome_completo,
          colaborador_cargo: f.colaboradores?.cargo,
          colaborador_departamento: f.colaboradores?.departamento
        }));
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 3
    });
  };

  // Criar período aquisitivo
  const criarPeriodoAquisitivoMutation = useMutation({
    mutationFn: async (periodo: Omit<PeriodoAquisitivo, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('periodos_aquisitivos')
        .insert(periodo)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['periodos-aquisitivos'] });
      toast.success('Período aquisitivo criado!');
    },
    onError: (error) => {
      toast.error('Erro ao criar período: ' + error.message);
    }
  });

  // Gerar períodos aquisitivos automaticamente
  const gerarPeriodosAquisitivos = async (colaboradorId: string, dataAdmissao: string) => {
    const hoje = new Date();
    const admissao = parseISO(dataAdmissao);
    const periodos: Omit<PeriodoAquisitivo, 'id' | 'created_at'>[] = [];
    
    let numero = 1;
    let inicio = admissao;
    
    while (inicio < hoje) {
      const fim = addDays(addYears(inicio, 1), -1);
      const status = fim < hoje ? 'adquirido' : 'em_aquisicao';
      
      periodos.push({
        colaborador_id: colaboradorId,
        numero_periodo: numero,
        data_inicio: format(inicio, 'yyyy-MM-dd'),
        data_fim: format(fim, 'yyyy-MM-dd'),
        dias_direito: 30,
        faltas_periodo: 0,
        dias_descontados: 0,
        status
      });
      
      inicio = addYears(inicio, 1);
      numero++;
    }
    
    // Inserir períodos em batch
    if (periodos.length > 0) {
      const { error } = await supabase
        .from('periodos_aquisitivos')
        .upsert(periodos, { onConflict: 'colaborador_id,numero_periodo' });
      
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['periodos-aquisitivos'] });
    }
    
    return periodos;
  };

  // Programar férias
  const programarFeriasMutation = useMutation({
    mutationFn: async (ferias: Omit<Ferias, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('ferias')
        .insert({ ...ferias, empresa_id: empresaAtualId })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferias'] });
      queryClient.invalidateQueries({ queryKey: ['periodos-aquisitivos'] });
      toast.success('Férias programadas com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao programar férias: ' + error.message);
    }
  });

  // Aprovar férias
  const aprovarFeriasMutation = useMutation({
    mutationFn: async ({ feriasId, aprovadoPor }: { feriasId: string; aprovadoPor: string }) => {
      const { data, error } = await supabase
        .from('ferias')
        .update({
          status: 'aprovada',
          aprovado_por: aprovadoPor,
          aprovado_em: new Date().toISOString()
        })
        .eq('id', feriasId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferias'] });
      toast.success('Férias aprovadas!');
    },
    onError: (error) => {
      toast.error('Erro ao aprovar férias: ' + error.message);
    }
  });

  // Cancelar férias
  const cancelarFeriasMutation = useMutation({
    mutationFn: async (feriasId: string) => {
      const { data, error } = await supabase
        .from('ferias')
        .update({ status: 'cancelada' })
        .eq('id', feriasId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferias'] });
      toast.success('Férias canceladas!');
    },
    onError: (error) => {
      toast.error('Erro ao cancelar férias: ' + error.message);
    }
  });

  // Calcular data limite para concessão (período concessivo)
  const calcularPeriodoConcessivo = (periodoAquisitivo: PeriodoAquisitivo) => {
    const fimAquisitivo = parseISO(periodoAquisitivo.data_fim);
    const inicioConcessivo = addDays(fimAquisitivo, 1);
    const fimConcessivo = addYears(inicioConcessivo, 1);
    
    return {
      inicio: format(inicioConcessivo, 'yyyy-MM-dd'),
      fim: format(fimConcessivo, 'yyyy-MM-dd'),
      diasRestantes: differenceInDays(fimConcessivo, new Date())
    };
  };

  return {
    usePeriodosAquisitivos,
    useFeriasQuery,
    criarPeriodoAquisitivo: criarPeriodoAquisitivoMutation.mutate,
    gerarPeriodosAquisitivos,
    programarFerias: programarFeriasMutation.mutate,
    aprovarFerias: aprovarFeriasMutation.mutate,
    cancelarFerias: cancelarFeriasMutation.mutate,
    calcularPeriodoConcessivo,
    calcularFerias,
    calcularDiasDireito,
    isProgramando: programarFeriasMutation.isPending,
    isAprovando: aprovarFeriasMutation.isPending
  };
};
