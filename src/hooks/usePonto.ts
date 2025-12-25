/**
 * @fileoverview Hook para gerenciamento de ponto
 * @module hooks/usePonto
 */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RegistroPonto, BancoHoras, Feriado, EspelhoPonto, ResumoMensal } from '@/types/ponto';
import { useEmpresas } from './useEmpresas';
import { useAuditoriaIntegration } from './useAuditoriaIntegration';

// Helper para converter interval do Postgres para minutos
const intervalToMinutes = (interval: string | null): number => {
  if (!interval) return 0;
  const match = interval.match(/(\d+):(\d+):(\d+)/);
  if (match) {
    return parseInt(match[1]) * 60 + parseInt(match[2]);
  }
  return 0;
};

// Helper para converter minutos para formato HH:MM
const minutesToInterval = (minutes: number): string => {
  const hours = Math.floor(Math.abs(minutes) / 60);
  const mins = Math.abs(minutes) % 60;
  const sign = minutes < 0 ? '-' : '';
  return `${sign}${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Calcular horas entre dois horários
const calcularHoras = (entrada: string | null, saida: string | null): number => {
  if (!entrada || !saida) return 0;
  const [h1, m1] = entrada.split(':').map(Number);
  const [h2, m2] = saida.split(':').map(Number);
  return (h2 * 60 + m2) - (h1 * 60 + m1);
};

// Calcular total de horas trabalhadas em um registro
const calcularHorasTrabalhadas = (registro: Partial<RegistroPonto>): number => {
  let total = 0;
  total += calcularHoras(registro.entrada_1 || null, registro.saida_1 || null);
  total += calcularHoras(registro.entrada_2 || null, registro.saida_2 || null);
  total += calcularHoras(registro.entrada_3 || null, registro.saida_3 || null);
  return total;
};

export interface UsePontoReturn {
  useRegistrosPonto: (colaboradorId: string | null, dataInicio: string, dataFim: string) => ReturnType<typeof useQuery>;
  useFeriados: (ano: number) => ReturnType<typeof useQuery>;
  useBancoHoras: (colaboradorId: string | null) => ReturnType<typeof useQuery>;
  registrarPonto: (registro: Omit<RegistroPonto, "id" | "created_at" | "updated_at">) => void;
  registrarBancoHoras: (movimento: Omit<BancoHoras, "id" | "created_at">) => void;
  gerarEspelhoPonto: (colaboradorId: string, colaboradorNome: string, colaboradorCargo: string, colaboradorDepartamento: string, competencia: string) => Promise<EspelhoPonto>;
  calcularResumoMensal: (colaboradorId: string, competencia: string) => Promise<ResumoMensal>;
  isRegistrando: boolean;
}

export const usePonto = (): UsePontoReturn => {
  const queryClient = useQueryClient();
  const { empresaAtualId } = useEmpresas();

  // Buscar registros de ponto por colaborador e período
  const useRegistrosPonto = (colaboradorId: string | null, dataInicio: string, dataFim: string) => {
    return useQuery({
      queryKey: ['registros-ponto', colaboradorId, dataInicio, dataFim],
      staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    queryFn: async () => {
        if (!colaboradorId) return [];
        const { data, error } = await supabase
          .from('registros_ponto')
          .select('id, colaborador_id, data, entrada, saida, observacoes')
          .eq('colaborador_id', colaboradorId)
          .gte('data', dataInicio)
          .lte('data', dataFim)
          .order('data', { ascending: true });
        
        if (error) throw error;
        return data as RegistroPonto[];
      },
      enabled: !!colaboradorId
    });
  };

  // Buscar feriados
  const useFeriados = (ano: number) => {
    return useQuery({
      queryKey: ['feriados', ano, empresaAtualId],
      staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    queryFn: async () => {
        let query = supabase
          .from('feriados')
          .select('id, colaborador_id, data, entrada, saida, observacoes')
          .gte('data', `${ano}-01-01`)
          .lte('data', `${ano}-12-31`);
        
        if (empresaAtualId) {
          query = query.or(`empresa_id.eq.${empresaAtualId},empresa_id.is.null`);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data as Feriado[];
      }
    });
  };

  // Buscar saldo do banco de horas
  const useBancoHoras = (colaboradorId: string | null) => {
    return useQuery({
      queryKey: ['banco-horas', colaboradorId],
      staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    queryFn: async () => {
        if (!colaboradorId) return [];
        const { data, error } = await supabase
          .from('banco_horas')
          .select('id, colaborador_id, data, entrada, saida, observacoes')
          .eq('colaborador_id', colaboradorId)
          .order('data', { ascending: false })
          .limit(50);
        
        if (error) throw error;
        return data as BancoHoras[];
      },
      enabled: !!colaboradorId
    });
  };

  // Registrar ponto
  const registrarPontoMutation = useMutation({
    mutationFn: async (registro: Omit<RegistroPonto, 'id' | 'created_at' | 'updated_at'>) => {
      // Calcular horas trabalhadas
      const minutosTrabalhados = calcularHorasTrabalhadas(registro);
      const horasTrabalhadas = minutesToInterval(minutosTrabalhados);
      
      // Buscar jornada do colaborador
      const { data: colaborador } = await supabase
        .from('colaboradores')
        .select('jornada_semanal')
        .eq('id', registro.colaborador_id)
        .single();
      
      const jornadaDiaria = ((colaborador?.jornada_semanal || 44) / 6) * 60; // em minutos
      
      // Calcular horas extras ou falta
      let horasExtras = '00:00:00';
      let horasFalta = '00:00:00';
      
      if (registro.tipo_dia === 'normal') {
        const diferenca = minutosTrabalhados - jornadaDiaria;
        if (diferenca > 0) {
          horasExtras = minutesToInterval(diferenca) + ':00';
        } else if (diferenca < 0) {
          horasFalta = minutesToInterval(Math.abs(diferenca)) + ':00';
        }
      }

      const { data, error } = await supabase
        .from('registros_ponto')
        .upsert({
          ...registro,
          empresa_id: empresaAtualId,
          horas_trabalhadas: horasTrabalhadas + ':00',
          horas_extras: horasExtras,
          horas_falta: horasFalta
        }, { onConflict: 'colaborador_id,data' })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registros-ponto'] });
      queryClient.invalidateQueries({ queryKey: ['banco-horas'] });
      toast.success('Ponto registrado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao registrar ponto: ' + error.message);
    }
  });

  // Registrar movimento no banco de horas
  const registrarBancoHorasMutation = useMutation({
    mutationFn: async (movimento: Omit<BancoHoras, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('banco_horas')
        .insert(movimento)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banco-horas'] });
      toast.success('Banco de horas atualizado!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar banco de horas: ' + error.message);
    }
  });

  // Gerar espelho de ponto
  const gerarEspelhoPonto = async (
    colaboradorId: string,
    colaboradorNome: string,
    colaboradorCargo: string,
    colaboradorDepartamento: string,
    competencia: string
  ): Promise<EspelhoPonto> => {
    const [ano, mes] = competencia.split('-').map(Number);
    const dataInicio = `${competencia}-01`;
    const ultimoDia = new Date(ano, mes, 0).getDate();
    const dataFim = `${competencia}-${ultimoDia}`;

    const { data: registros, error } = await supabase
      .from('registros_ponto')
      .select('id, colaborador_id, data, entrada, saida, observacoes')
      .eq('colaborador_id', colaboradorId)
      .gte('data', dataInicio)
      .lte('data', dataFim)
      .order('data', { ascending: true });

    if (error) throw error;

    // Calcular totais
    let totalMinutosTrabalhados = 0;
    let totalMinutosExtras = 0;
    let totalMinutosFalta = 0;

    (registros ?? []).forEach((reg) => {
      const registro = reg as RegistroPonto;
      totalMinutosTrabalhados += intervalToMinutes(registro.horas_trabalhadas);
      totalMinutosExtras += intervalToMinutes(registro.horas_extras);
      totalMinutosFalta += intervalToMinutes(registro.horas_falta);
    });

    // Buscar saldo do banco de horas
    const { data: bancoHoras } = await supabase
      .from('banco_horas')
      .select('id, colaborador_id, data, entrada, saida, observacoes')
      .eq('colaborador_id', colaboradorId)
      .order('data', { ascending: false })
      .limit(1);

    const saldo = (bancoHoras?.[0] as BancoHoras | undefined)?.saldo_atual || '00:00:00';

    return {
      colaborador_id: colaboradorId,
      colaborador_nome: colaboradorNome,
      colaborador_cargo: colaboradorCargo,
      colaborador_departamento: colaboradorDepartamento,
      competencia,
      registros: registros as RegistroPonto[],
      total_horas_trabalhadas: minutesToInterval(totalMinutosTrabalhados),
      total_horas_extras: minutesToInterval(totalMinutosExtras),
      total_horas_falta: minutesToInterval(totalMinutosFalta),
      saldo_banco_horas: saldo
    };
  };

  // Calcular resumo mensal
  const calcularResumoMensal = (registros: RegistroPonto[], jornadaSemanal: number = 44): ResumoMensal => {
    const jornadaDiaria = (jornadaSemanal / 6) * 60; // em minutos
    
    let diasTrabalhados = 0;
    let totalMinutosTrabalhados = 0;
    let totalMinutosExtras50 = 0;
    let totalMinutosExtras100 = 0;
    let totalMinutosFalta = 0;
    let totalMinutosAtrasos = 0;

    registros.forEach(reg => {
      if (reg.tipo_dia === 'normal' && reg.entrada_1) {
        diasTrabalhados++;
        totalMinutosTrabalhados += intervalToMinutes(reg.horas_trabalhadas);
        
        const extras = intervalToMinutes(reg.horas_extras);
        // Primeiras 2 horas = 50%, restante = 100%
        if (extras > 0) {
          totalMinutosExtras50 += Math.min(extras, 120);
          totalMinutosExtras100 += Math.max(0, extras - 120);
        }
        
        totalMinutosFalta += intervalToMinutes(reg.horas_falta);
      } else if (['feriado', 'folga'].includes(reg.tipo_dia) && reg.entrada_1) {
        // Trabalho em feriado/folga = 100%
        totalMinutosExtras100 += intervalToMinutes(reg.horas_trabalhadas);
      }
    });

    // Calcular horas previstas (dias úteis * jornada diária)
    const diasUteis = registros.filter(r => r.tipo_dia === 'normal').length;
    const horasPrevistas = diasUteis * jornadaDiaria;

    return {
      dias_trabalhados: diasTrabalhados,
      dias_uteis: diasUteis,
      horas_previstas: minutesToInterval(horasPrevistas),
      horas_trabalhadas: minutesToInterval(totalMinutosTrabalhados),
      horas_extras_50: minutesToInterval(totalMinutosExtras50),
      horas_extras_100: minutesToInterval(totalMinutosExtras100),
      horas_falta: minutesToInterval(totalMinutosFalta),
      atrasos: minutesToInterval(totalMinutosAtrasos),
      banco_horas_credito: minutesToInterval(totalMinutosExtras50 + totalMinutosExtras100),
      banco_horas_debito: minutesToInterval(totalMinutosFalta),
      saldo_banco_horas: minutesToInterval((totalMinutosExtras50 + totalMinutosExtras100) - totalMinutosFalta)
    };
  };

  return {
    useRegistrosPonto,
    useFeriados,
    useBancoHoras,
    registrarPonto: registrarPontoMutation.mutate,
    registrarBancoHoras: registrarBancoHorasMutation.mutate,
    gerarEspelhoPonto,
    calcularResumoMensal,
    isRegistrando: registrarPontoMutation.isPending
  };
};

// Hook para resumo de ponto (sem alterações significativas, apenas adicionando empresa)
export const useResumoPonto = (competencia: string) => {
  const { empresaAtualId } = useEmpresas();
  
  return useQuery({
    queryKey: ['resumo-ponto', competencia, empresaAtualId],
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    queryFn: async () => {
      const [ano, mes] = competencia.split('-').map(Number);
      const dataInicio = `${competencia}-01`;
      const ultimoDia = new Date(ano, mes, 0).getDate();
      const dataFim = `${competencia}-${ultimoDia}`;

      let query = supabase
        .from('registros_ponto')
        .select(`
          *,
          colaboradores!inner(nome_completo, cargo, departamento, empresa_id)
        `)
        .gte('data', dataInicio)
        .lte('data', dataFim);

      if (empresaAtualId) {
        query = query.eq('empresa_id', empresaAtualId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });
};






