// @ts-nocheck
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfYear, endOfYear, startOfMonth, endOfMonth, format, subMonths, differenceInDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TurnoverData {
  admissoes: number;
  desligamentos: number;
  totalColaboradores: number;
  turnoverRate: number;
}

interface TurnoverMonthData {
  mes: string;
  mesLabel: string;
  admissoes: number;
  desligamentos: number;
  turnoverRate: number;
  totalColaboradores: number;
}

interface TurnoverYearData {
  ano: number;
  admissoes: number;
  desligamentos: number;
  turnover: number;
}

interface AbsenteeismData {
  departamento: string;
  faltas: number;
  atestados: number;
  diasUteis: number;
  colaboradores: number;
  taxaAbsenteismo: number;
}

interface PayrollCostData {
  departamento: string;
  custoTotal: number;
  colaboradores: number;
  custoMedio: number;
}

interface IndicadoresDP {
  turnover: TurnoverData;
  turnoverEvolution: TurnoverMonthData[];
  turnoverYearComparison: TurnoverYearData[];
  absenteeism: AbsenteeismData[];
  payrollCost: PayrollCostData[];
  kpis: {
    colaboradoresAtivos: number;
    admissoesEmCurso: number;
    feriasEsteMes: number;
    afastadosHoje: number;
    pontosPendentes: number;
    folhaProjetada: number;
    desligamentosEmCurso: number;
    alertasUrgentes: number;
  };
  loading: boolean;
}

export function useIndicadoresDP(periodo: 'month' | 'quarter' | 'year' = 'year') {
  const now = new Date();
  
  // Calcular datas do período
  const getDateRange = () => {
    switch (periodo) {
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'quarter':
        return { start: startOfMonth(subMonths(now, 2)), end: endOfMonth(now) };
      case 'year':
      default:
        return { start: startOfYear(now), end: endOfYear(now) };
    }
  };
  
  const { start: dataInicio, end: dataFim } = getDateRange();
  const dataInicioStr = format(dataInicio, 'yyyy-MM-dd');
  const dataFimStr = format(dataFim, 'yyyy-MM-dd');
  const competenciaAtual = format(now, 'yyyy-MM');

  // Query para colaboradores
  const colaboradoresQuery = useQuery({
    queryKey: ['indicadores-colaboradores'],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('colaboradores')
        .select('id, status, departamento, data_admissao, data_desligamento, salario_base');
      
      if (error) throw error;
      return data ?? [];
    }
  });

  // Query para turnover (admissões e desligamentos no período)
  const turnoverQuery = useQuery({
    queryKey: ['indicadores-turnover', dataInicioStr, dataFimStr],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      // Admissões no período
      const { data: admissoes, error: errAdm } = await supabase
        .from('colaboradores')
        .select('id')
        .gte('data_admissao', dataInicioStr)
        .lte('data_admissao', dataFimStr);
      
      if (errAdm) throw errAdm;

      // Desligamentos no período
      const { data: desligamentos, error: errDesl } = await supabase
        .from('colaboradores')
        .select('id')
        .not('data_desligamento', 'is', null)
        .gte('data_desligamento', dataInicioStr)
        .lte('data_desligamento', dataFimStr);
      
      if (errDesl) throw errDesl;

      // Total de colaboradores ativos
      const { count: total, error: errTotal } = await supabase
        .from('colaboradores')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ativo');
      
      if (errTotal) throw errTotal;

      return {
        admissoes: admissoes?.length ?? 0,
        desligamentos: desligamentos?.length ?? 0,
        total: total || 1
      };
    }
  });

  // Query para evolução do turnover (últimos 12 meses)
  const turnoverEvolutionQuery = useQuery({
    queryKey: ['indicadores-turnover-evolution'],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      const months: TurnoverMonthData[] = [];
      
      // Buscar todos os colaboradores com datas de admissão e desligamento
      const { data: colaboradores, error } = await supabase
        .from('colaboradores')
        .select('id, data_admissao, data_desligamento, status');
      
      if (error) throw error;
      
      // Processar os últimos 12 meses
      for (let i = 11; i >= 0; i--) {
        const monthDate = subMonths(now, i);
        const monthStart = format(startOfMonth(monthDate), 'yyyy-MM-dd');
        const monthEnd = format(endOfMonth(monthDate), 'yyyy-MM-dd');
        const mesKey = format(monthDate, 'yyyy-MM');
        const mesLabel = format(monthDate, 'MMM/yy', { locale: ptBR });
        
        // Contar admissões no mês
        const admissoes = colaboradores?.filter(c => {
          const admDate = c.data_admissao;
          return admDate >= monthStart && admDate <= monthEnd;
        }).length ?? 0;
        
        // Contar desligamentos no mês
        const desligamentos = colaboradores?.filter(c => {
          const deslDate = c.data_desligamento;
          return deslDate && deslDate >= monthStart && deslDate <= monthEnd;
        }).length ?? 0;
        
        // Estimar total de colaboradores ativos no final do mês
        const totalAtivos = colaboradores?.filter(c => {
          const admDate = c.data_admissao;
          const deslDate = c.data_desligamento;
          const wasAdmittedBefore = admDate <= monthEnd;
          const wasNotDismissedYet = !deslDate || deslDate > monthEnd;
          return wasAdmittedBefore && wasNotDismissedYet;
        }).length || 1;
        
        // Calcular taxa de turnover mensal
        const turnoverRate = totalAtivos > 0 
          ? ((admissoes + desligamentos) / 2) / totalAtivos * 100 
          : 0;
        
        months.push({
          mes: mesKey,
          mesLabel: mesLabel.charAt(0).toUpperCase() + mesLabel.slice(1),
          admissoes,
          desligamentos,
          turnoverRate,
          totalColaboradores: totalAtivos
        });
      }
      
      return months;
    }
  });

  // Query para comparativo anual de turnover (últimos 5 anos)
  const turnoverYearQuery = useQuery({
    queryKey: ['indicadores-turnover-year-comparison'],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      const currentYear = now.getFullYear();
      const years: TurnoverYearData[] = [];
      
      // Buscar todos os colaboradores
      const { data: colaboradores, error } = await supabase
        .from('colaboradores')
        .select('id, data_admissao, data_desligamento, status');
      
      if (error) throw error;
      
      // Processar os últimos 5 anos
      for (let i = 4; i >= 0; i--) {
        const year = currentYear - i;
        const yearStart = `${year}-01-01`;
        const yearEnd = `${year}-12-31`;
        
        // Contar admissões no ano
        const admissoes = colaboradores?.filter(c => {
          const admDate = c.data_admissao;
          return admDate >= yearStart && admDate <= yearEnd;
        }).length ?? 0;
        
        // Contar desligamentos no ano
        const desligamentos = colaboradores?.filter(c => {
          const deslDate = c.data_desligamento;
          return deslDate && deslDate >= yearStart && deslDate <= yearEnd;
        }).length ?? 0;
        
        // Estimar total de colaboradores ativos no final do ano
        const totalAtivos = colaboradores?.filter(c => {
          const admDate = c.data_admissao;
          const deslDate = c.data_desligamento;
          const wasAdmittedBefore = admDate <= yearEnd;
          const wasNotDismissedYet = !deslDate || deslDate > yearEnd;
          return wasAdmittedBefore && wasNotDismissedYet;
        }).length || 1;
        
        // Calcular taxa de turnover anual
        const turnover = totalAtivos > 0 
          ? ((admissoes + desligamentos) / 2) / totalAtivos * 100 
          : 0;
        
        years.push({
          ano: year,
          admissoes,
          desligamentos,
          turnover: Math.round(turnover * 10) / 10
        });
      }
      
      return years;
    }
  });

  const afastamentosQuery = useQuery({
    queryKey: ['indicadores-afastamentos', competenciaAtual],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      const mesInicio = format(startOfMonth(now), 'yyyy-MM-dd');
      const mesFim = format(endOfMonth(now), 'yyyy-MM-dd');

      // Afastamentos do mês atual
      const { data: afastamentos, error } = await supabase
        .from('afastamentos')
        .select(`
          id,
          data_inicio,
          data_fim_prevista,
          data_fim_real,
          tipo,
          colaboradores!inner(departamento)
        `)
        .or(`data_inicio.lte.${mesFim},data_fim_prevista.gte.${mesInicio}`)
        .in('status', ['ativo', 'prorrogado', 'encerrado']);
      
      if (error) throw error;
      return afastamentos ?? [];
    }
  });

  // Query para registros de ponto (faltas)
  const pontoQuery = useQuery({
    queryKey: ['indicadores-ponto', competenciaAtual],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      const mesInicio = format(startOfMonth(now), 'yyyy-MM-dd');
      const mesFim = format(endOfMonth(now), 'yyyy-MM-dd');

      // Registros de ponto com faltas
      const { data: registros, error } = await supabase
        .from('registros_ponto')
        .select(`
          id,
          data,
          horas_falta,
          colaboradores!inner(departamento)
        `)
        .gte('data', mesInicio)
        .lte('data', mesFim);
      
      if (error) throw error;
      return registros ?? [];
    }
  });

  // Query para folha de pagamento (custo por departamento)
  const folhaQuery = useQuery({
    queryKey: ['indicadores-folha', competenciaAtual],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      // Buscar última folha calculada
      const { data: folha, error: errFolha } = await supabase
        .from('folhas_pagamento')
        .select('id, competencia, total_proventos')
        .eq('status', 'calculada')
        .order('competencia', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (errFolha) throw errFolha;

      if (!folha) {
        // Se não há folha calculada, usar salários base
        return { holerites: [], usarSalarioBase: true };
      }

      // Buscar holerites da folha
      const { data: holerites, error: errHol } = await supabase
        .from('holerites')
        .select('colaborador_departamento, total_proventos, liquido')
        .eq('folha_id', folha.id);
      
      if (errHol) throw errHol;

      return { holerites: holerites ?? [], usarSalarioBase: false };
    }
  });

  // Query para férias do mês
  const feriasQuery = useQuery({
    queryKey: ['indicadores-ferias', competenciaAtual],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      const mesInicio = format(startOfMonth(now), 'yyyy-MM-dd');
      const mesFim = format(endOfMonth(now), 'yyyy-MM-dd');

      const { count, error } = await supabase
        .from('ferias')
        .select('*', { count: 'exact', head: true })
        .or(`data_inicio.lte.${mesFim},data_fim.gte.${mesInicio}`)
        .in('status', ['aprovada', 'em_gozo']);
      
      if (error) throw error;
      return count ?? 0;
    }
  });

  // Query para pontos pendentes
  const pontosPendentesQuery = useQuery({
    queryKey: ['indicadores-pontos-pendentes'],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      const { count, error } = await supabase
        .from('registros_ponto')
        .select('*', { count: 'exact', head: true })
        .eq('aprovado', false);
      
      if (error) throw error;
      return count ?? 0;
    }
  });

  // Query para afastados hoje
  const afastadosHojeQuery = useQuery({
    queryKey: ['indicadores-afastados-hoje'],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      const hoje = format(now, 'yyyy-MM-dd');

      const { count, error } = await supabase
        .from('afastamentos')
        .select('*', { count: 'exact', head: true })
        .lte('data_inicio', hoje)
        .gte('data_fim_prevista', hoje)
        .in('status', ['ativo', 'prorrogado']);
      
      if (error) throw error;
      return count ?? 0;
    }
  });

  // Processar dados
  const processData = (): IndicadoresDP => {
    const loading = colaboradoresQuery.isLoading || 
                    turnoverQuery.isLoading || 
                    turnoverEvolutionQuery.isLoading ||
                    turnoverYearQuery.isLoading ||
                    afastamentosQuery.isLoading ||
                    pontoQuery.isLoading ||
                    folhaQuery.isLoading;

    const colaboradores = colaboradoresQuery.data ?? [];
    const turnoverData = turnoverQuery.data || { admissoes: 0, desligamentos: 0, total: 1 };
    const turnoverEvolution = turnoverEvolutionQuery.data ?? [];
    const turnoverYearComparison = turnoverYearQuery.data ?? [];
    const afastamentos = afastamentosQuery.data ?? [];
    const registrosPonto = pontoQuery.data ?? [];
    const folhaData = folhaQuery.data || { holerites: [], usarSalarioBase: true };

    // Calcular turnover
    const turnoverRate = ((turnoverData.admissoes + turnoverData.desligamentos) / 2) / turnoverData.total * 100;

    // Agrupar por departamento para absenteísmo
    const departamentos = [...new Set(colaboradores.map(c => c.departamento))];
    const diasUteisMes = 22; // Aproximação

    const absenteeismByDept: AbsenteeismData[] = departamentos.map(dept => {
      const colabsDept = colaboradores.filter(c => c.departamento === dept && c.status === 'ativo');
      
      // Contar atestados (afastamentos do departamento)
      const atestadosDept = afastamentos.filter((a: unknown) => 
        a.colaboradores?.departamento === dept
      );
      
      let diasAfastados = 0;
      atestadosDept.forEach((a: unknown) => {
        const inicio = parseISO(a.data_inicio);
        const fim = a.data_fim_real ? parseISO(a.data_fim_real) : parseISO(a.data_fim_prevista);
        diasAfastados += Math.min(differenceInDays(fim, inicio) + 1, diasUteisMes);
      });

      // Contar faltas do ponto
      const faltasDept = registrosPonto.filter((r: unknown) => 
        r.colaboradores?.departamento === dept && r.horas_falta
      ).length;

      const totalDiasPrevistos = colabsDept.length * diasUteisMes;
      const taxaAbsenteismo = totalDiasPrevistos > 0 
        ? ((diasAfastados + faltasDept) / totalDiasPrevistos) * 100 
        : 0;

      return {
        departamento: dept,
        faltas: faltasDept,
        atestados: atestadosDept.length,
        diasUteis: diasUteisMes,
        colaboradores: colabsDept.length,
        taxaAbsenteismo: Math.min(taxaAbsenteismo, 100)
      };
    }).filter(d => d.colaboradores > 0);

    // Calcular custo de folha por departamento
    let payrollCost: PayrollCostData[] = [];

    if (folhaData.usarSalarioBase || folhaData.holerites.length === 0) {
      // Usar salário base quando não há folha calculada
      const custoByDept = new Map<string, { total: number; count: number }>();
      
      colaboradores
        .filter(c => c.status === 'ativo')
        .forEach(c => {
          const current = custoByDept.get(c.departamento) || { total: 0, count: 0 };
          custoByDept.set(c.departamento, {
            total: current.total + (c.salario_base ?? 0),
            count: current.count + 1
          });
        });

      payrollCost = Array.from(custoByDept.entries()).map(([dept, data]) => ({
        departamento: dept,
        custoTotal: data.total,
        colaboradores: data.count,
        custoMedio: data.count > 0 ? data.total / data.count : 0
      }));
    } else {
      // Usar dados da folha
      const custoByDept = new Map<string, { total: number; count: number }>();
      
      folhaData.holerites.forEach((h: unknown) => {
        const current = custoByDept.get(h.colaborador_departamento) || { total: 0, count: 0 };
        custoByDept.set(h.colaborador_departamento, {
          total: current.total + (h.total_proventos ?? 0),
          count: current.count + 1
        });
      });

      payrollCost = Array.from(custoByDept.entries()).map(([dept, data]) => ({
        departamento: dept,
        custoTotal: data.total,
        colaboradores: data.count,
        custoMedio: data.count > 0 ? data.total / data.count : 0
      }));
    }

    // KPIs
    const ativos = colaboradores.filter(c => c.status === 'ativo').length;
    const pendentes = colaboradores.filter(c => c.status === 'pendente').length;
    const folhaTotal = payrollCost.reduce((acc, p) => acc + p.custoTotal, 0);

    return {
      turnover: {
        admissoes: turnoverData.admissoes,
        desligamentos: turnoverData.desligamentos,
        totalColaboradores: turnoverData.total,
        turnoverRate
      },
      turnoverEvolution,
      turnoverYearComparison,
      absenteeism: absenteeismByDept,
      payrollCost,
      kpis: {
        colaboradoresAtivos: ativos,
        admissoesEmCurso: pendentes,
        feriasEsteMes: feriasQuery.data ?? 0,
        afastadosHoje: afastadosHojeQuery.data ?? 0,
        pontosPendentes: pontosPendentesQuery.data ?? 0,
        folhaProjetada: folhaTotal,
        desligamentosEmCurso: turnoverData.desligamentos,
        alertasUrgentes: Math.min((afastadosHojeQuery.data ?? 0) + (pontosPendentesQuery.data ?? 0), 10)
      },
      loading
    };
  };

  return processData();
}









