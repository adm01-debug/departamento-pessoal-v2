// @ts-nocheck
import { useState, useCallback } from 'react';
import { useAuditoriaIntegration } from './useAuditoriaIntegration';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isWeekend } from 'date-fns';
import { RegistroPonto, BancoHoras, Feriado, PeriodoPonto, AjustePonto, ResumoMensal, TipoDia, StatusPeriodo, StatusAjuste } from '@/types/ponto';

// =====================================================
// HELPERS
// =====================================================

// Converter interval do Postgres para minutos
export const intervalToMinutes = (interval: string | null): number => {
  if (!interval) return 0;
  const match = interval.match(/(-?)(\d+):(\d+)/);
  if (match) {
    const sign = match[1] === '-' ? -1 : 1;
    return sign * (parseInt(match[2]) * 60 + parseInt(match[3]));
  }
  return 0;
};

// Converter minutos para formato HH:MM
export const minutesToInterval = (minutes: number): string => {
  const sign = minutes < 0 ? '-' : '';
  const absMinutes = Math.abs(minutes);
  const hours = Math.floor(absMinutes / 60);
  const mins = absMinutes % 60;
  return `${sign}${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Formatar minutos para exibição amigável
export const formatarMinutos = (minutos: number): string => {
  const sign = minutos < 0 ? '-' : '';
  const absMinutos = Math.abs(minutos);
  const horas = Math.floor(absMinutos / 60);
  const mins = absMinutos % 60;
  if (horas === 0) return `${sign}${mins}min`;
  return `${sign}${horas}h${mins > 0 ? ` ${mins}min` : ''}`;
};

// Calcular horas entre dois horários
const calcularHoras = (entrada: string | null, saida: string | null): number => {
  if (!entrada || !saida) return 0;
  const [h1, m1] = entrada.split(':').map(Number);
  const [h2, m2] = saida.split(':').map(Number);
  return (h2 * 60 + m2) - (h1 * 60 + m1);
};

// Calcular total de horas trabalhadas
const calcularHorasTrabalhadas = (registro: Partial<RegistroPonto>): number => {
  let total = 0;
  total += calcularHoras(registro.entrada_1 || null, registro.saida_1 || null);
  total += calcularHoras(registro.entrada_2 || null, registro.saida_2 || null);
  total += calcularHoras(registro.entrada_3 || null, registro.saida_3 || null);
  return total;
};

// =====================================================
// HOOK PRINCIPAL
// =====================================================

export interface UsePontoMelhoradoReturn {
  useRegistrosPonto: (colaboradorId: string | null, dataInicio: string, dataFim: string) => ReturnType<typeof useQuery>;
  useFeriados: (ano: number) => ReturnType<typeof useQuery>;
  usePeriodos: () => ReturnType<typeof useQuery>;
  useAjustesPendentes: () => ReturnType<typeof useQuery>;
  useBancoHoras: (colaboradorId: string | null) => ReturnType<typeof useQuery>;
  registrarPonto: (registro: RegistroPontoInput) => void;
  registrarPontoAsync: (registro: RegistroPontoInput) => Promise<unknown>;
  isRegistrando: boolean;
  importarArquivo: (arquivo: File, empresaId: string, competencia: string) => Promise<void>;
  importProgress: number;
  fecharPeriodo: (periodoId: string) => void;
  reabrirPeriodo: (periodoId: string) => void;
  isFechandoPeriodo: boolean;
  solicitarAjuste: (ajuste: AjusteInput) => void;
  aprovarAjuste: (params: { ajusteId: string; aprovado: boolean; motivo?: string }) => void;
  isProcessandoAjuste: boolean;
  calcularResumoMensal: (colaboradorId: string, competencia: string) => Promise<ResumoMensal>;
}

export const usePontoMelhorado = (): UsePontoMelhoradoReturn => {
  const queryClient = useQueryClient();
  const [importProgress, setImportProgress] = useState(0);

  // ===== QUERIES =====

  // Buscar registros de ponto
  const useRegistrosPonto = (colaboradorId: string | null, dataInicio: string, dataFim: string) => {
    return useQuery({
      queryKey: ['registros-ponto', colaboradorId, dataInicio, dataFim],
      queryFn: async () => {
        if (!colaboradorId) return [];
        const { data, error } = await supabase
          .from('registros_ponto')
          .select('*')
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

  // Buscar todos os registros do período (para relatórios)
  const useRegistrosPeriodo = (competencia: string) => {
    const [ano, mes] = competencia.split('-').map(Number);
    const dataInicio = format(startOfMonth(new Date(ano, mes - 1)), 'yyyy-MM-dd');
    const dataFim = format(endOfMonth(new Date(ano, mes - 1)), 'yyyy-MM-dd');

    return useQuery({
      queryKey: ['registros-periodo', competencia],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('registros_ponto')
          .select(`
            *,
            colaborador:colaboradores(id, nome_completo, cargo, departamento, jornada_semanal)
          `)
          .gte('data', dataInicio)
          .lte('data', dataFim)
          .order('data', { ascending: true });
        
        if (error) throw error;
        return data;
      }
    });
  };

  // Buscar feriados
  const useFeriados = (ano: number) => {
    return useQuery({
      queryKey: ['feriados', ano],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('feriados')
          .select('*')
          .gte('data', `${ano}-01-01`)
          .lte('data', `${ano}-12-31`);
        
        if (error) throw error;
        return data as Feriado[];
      }
    });
  };

  // Buscar períodos de ponto
  const usePeriodos = () => {
    return useQuery({
      queryKey: ['periodos-ponto'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('periodos_ponto')
          .select('*')
          .order('competencia', { ascending: false })
          .limit(12);
        
        if (error) throw error;
        return data as PeriodoPonto[];
      }
    });
  };

  // Buscar ajustes pendentes
  const useAjustesPendentes = () => {
    return useQuery({
      queryKey: ['ajustes-pendentes'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('ajustes_ponto')
          .select(`
            *,
            colaborador:colaboradores(nome_completo),
            registro:registros_ponto(data)
          `)
          .eq('status', 'pendente')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as (AjustePonto & { colaborador: { nome_completo: string }, registro: { data: string } })[];
      }
    });
  };

  // Buscar banco de horas
  const useBancoHoras = (colaboradorId: string | null) => {
    return useQuery({
      queryKey: ['banco-horas', colaboradorId],
      queryFn: async () => {
        if (!colaboradorId) return { movimentos: [], saldo: 0 };
        
        const { data, error } = await supabase
          .from('banco_horas')
          .select('*')
          .eq('colaborador_id', colaboradorId)
          .order('data', { ascending: false })
          .limit(100);
        
        if (error) throw error;

        // Calcular saldo atual
        let saldo = 0;
        (data || []).forEach((mov: BancoHoras) => {
          const minutos = intervalToMinutes(mov.horas);
          saldo += mov.tipo === 'credito' ? minutos : -minutos;
        });

        return { 
          movimentos: data as BancoHoras[], 
          saldo 
        };
      },
      enabled: !!colaboradorId
    });
  };

  // ===== MUTATIONS =====

  // Registrar ponto
  const registrarPontoMutation = useMutation({
    mutationFn: async (registro: Omit<RegistroPonto, 'id' | 'created_at' | 'updated_at'>) => {
      const minutosTrabalhados = calcularHorasTrabalhadas(registro);
      const horasTrabalhadas = minutesToInterval(minutosTrabalhados);
      
      // Buscar jornada do colaborador
      const { data: colaborador } = await supabase
        .from('colaboradores')
        .select('jornada_semanal')
        .eq('id', registro.colaborador_id)
        .single();
      
      const jornadaDiaria = ((colaborador?.jornada_semanal || 44) / 6) * 60;
      
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
          horas_trabalhadas: horasTrabalhadas + ':00',
          horas_extras: horasExtras,
          horas_falta: horasFalta
        }, { onConflict: 'colaborador_id,data' })
        .select()
        .single();
      
      if (error) throw error;
      await auditoria.registrarCriacao('registros_ponto', data.id, { colaborador_id: registro.colaborador_id, data: registro.data });
      await auditoria.registrarCriacao('ajustes_ponto', data.id, { registro_ponto_id: ajuste.registro_ponto_id, tipo_ajuste: ajuste.tipo_ajuste });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registros-ponto'] });
      queryClient.invalidateQueries({ queryKey: ['registros-periodo'] });
      toast.success('Ponto registrado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao registrar ponto: ' + error.message);
    }
  });

  // ===== IMPORTAÇÃO DE ARQUIVO =====

  interface LinhaImportacao {
    matricula?: string;
    cpf?: string;
    data: string;
    entrada_1?: string;
    saida_1?: string;
    entrada_2?: string;
    saida_2?: string;
  }

  const importarArquivo = useCallback(async (
    arquivo: File,
    formato: 'csv' | 'txt_rep',
    competencia: string
  ): Promise<{ sucesso: number; erros: string[] }> => {
    setImportProgress(0);
    const erros: string[] = [];
    let sucesso = 0;

    try {
      const texto = await arquivo.text();
      const linhas = texto.split('\n').filter(l => l.trim());
      
      // Buscar colaboradores para mapear
      const { data: colaboradores } = await supabase
        .from('colaboradores')
        .select('id, matricula, cpf')
        .eq('status', 'ativo');

      const mapMatricula = new Map<string, string>();
      const mapCPF = new Map<string, string>();
      
      (colaboradores || []).forEach(c => {
        if (c.matricula) mapMatricula.set(c.matricula, c.id);
        if (c.cpf) mapCPF.set(c.cpf.replace(/\D/g, ''), c.id);
      });

      // Parsear arquivo
      let registros: LinhaImportacao[] = [];
      
      if (formato === 'csv') {
        // CSV: matricula,data,entrada_1,saida_1,entrada_2,saida_2
        const cabecalho = linhas[0].toLowerCase();
        const temCabecalho = cabecalho.includes('matricula') || cabecalho.includes('cpf');
        const linhasDados = temCabecalho ? linhas.slice(1) : linhas;
        
        registros = linhasDados.map((linha, idx) => {
          const cols = linha.split(/[,;]/).map(c => c.trim());
          if (cols.length < 6) {
            erros.push(`Linha ${idx + 1}: formato inválido`);
            return null;
          }
          return {
            matricula: cols[0],
            data: cols[1],
            entrada_1: cols[2] || undefined,
            saida_1: cols[3] || undefined,
            entrada_2: cols[4] || undefined,
            saida_2: cols[5] || undefined,
          };
        }).filter(Boolean) as LinhaImportacao[];
      } else {
        // TXT REP (formato AFD - comum em relógios de ponto)
        // Formato típico: NSR|TipoPIS|DataHora
        registros = linhas.map((linha, idx) => {
          // Formato simplificado: MATRICULA|DATA|HORA
          const cols = linha.split('|').map(c => c.trim());
          if (cols.length < 3) return null;
          
          const matricula = cols[0];
          const dataStr = cols[1]; // DDMMYYYY ou DD/MM/YYYY
          const hora = cols[2]; // HHMM ou HH:MM
          
          // Converter data
          let dataFormatada = '';
          if (dataStr.includes('/')) {
            const [d, m, a] = dataStr.split('/');
            dataFormatada = `${a}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
          } else if (dataStr.length === 8) {
            dataFormatada = `${dataStr.slice(4, 8)}-${dataStr.slice(2, 4)}-${dataStr.slice(0, 2)}`;
          }

          // Converter hora
          let horaFormatada = hora;
          if (!hora.includes(':')) {
            horaFormatada = `${hora.slice(0, 2)}:${hora.slice(2, 4)}`;
          }

          return {
            matricula,
            data: dataFormatada,
            entrada_1: horaFormatada,
          };
        }).filter(Boolean) as LinhaImportacao[];

        // Agrupar batidas por colaborador/data
        const agrupado = new Map<string, LinhaImportacao>();
        registros.forEach(r => {
          const chave = `${r.matricula}-${r.data}`;
          const existente = agrupado.get(chave);
          
          if (!existente) {
            agrupado.set(chave, r);
          } else {
            // Adicionar próxima batida
            if (!existente.saida_1) existente.saida_1 = r.entrada_1;
            else if (!existente.entrada_2) existente.entrada_2 = r.entrada_1;
            else if (!existente.saida_2) existente.saida_2 = r.entrada_1;
          }
        });
        registros = Array.from(agrupado.values());
      }

      // Inserir registros
      const total = registros.length;
      for (let i = 0; i < registros.length; i++) {
        const reg = registros[i];
        setImportProgress(Math.round((i / total) * 100));

        // Encontrar colaborador
        const colaboradorId = mapMatricula.get(reg.matricula || '') || 
                             mapCPF.get((reg.cpf || '').replace(/\D/g, ''));
        
        if (!colaboradorId) {
          erros.push(`Matrícula/CPF não encontrado: ${reg.matricula || reg.cpf}`);
          continue;
        }

        // Validar data
        if (!reg.data || !reg.data.match(/^\d{4}-\d{2}-\d{2}$/)) {
          erros.push(`Data inválida: ${reg.data}`);
          continue;
        }

        // Verificar se pertence à competência
        if (!reg.data.startsWith(competencia)) {
          erros.push(`Data fora da competência: ${reg.data}`);
          continue;
        }

        try {
          await registrarPontoMutation.mutateAsync({
            colaborador_id: colaboradorId,
            data: reg.data,
            entrada_1: reg.entrada_1 || null,
            saida_1: reg.saida_1 || null,
            entrada_2: reg.entrada_2 || null,
            saida_2: reg.saida_2 || null,
            entrada_3: null,
            saida_3: null,
            tipo_dia: 'normal' as TipoDia,
            horas_trabalhadas: null,
            horas_extras: null,
            horas_falta: null,
            justificativa: null,
            aprovado: false,
            aprovado_por: null,
            aprovado_em: null,
            observacoes: 'Importado via arquivo',
            created_by: null,
          });
          sucesso++;
        } catch (err: unknown) {
          erros.push(`Erro ao importar ${reg.matricula} - ${reg.data}: ${err.message}`);
        }
      }

      setImportProgress(100);
      queryClient.invalidateQueries({ queryKey: ['registros-ponto'] });
      queryClient.invalidateQueries({ queryKey: ['registros-periodo'] });

      return { sucesso, erros };
    } catch (err: unknown) {
      throw new Error('Erro ao processar arquivo: ' + err.message);
    }
  }, [queryClient, registrarPontoMutation]);

  // ===== FECHAMENTO DE PERÍODO =====

  const fecharPeriodoMutation = useMutation({
    mutationFn: async (competencia: string) => {
      const [ano, mes] = competencia.split('-').map(Number);
      const dataInicio = format(startOfMonth(new Date(ano, mes - 1)), 'yyyy-MM-dd');
      const dataFim = format(endOfMonth(new Date(ano, mes - 1)), 'yyyy-MM-dd');

      // Verificar se existe período
      const { data: periodoExistente } = await supabase
        .from('periodos_ponto')
        .select('*')
        .eq('competencia', competencia)
        .single();

      if (periodoExistente?.status === 'fechado') {
        throw new Error('Período já está fechado');
      }

      // Verificar ajustes pendentes
      const { data: ajustesPendentes } = await supabase
        .from('ajustes_ponto')
        .select('id')
        .eq('status', 'pendente')
        .gte('created_at', dataInicio)
        .lte('created_at', dataFim);

      if (ajustesPendentes && ajustesPendentes.length > 0) {
        throw new Error(`Existem ${ajustesPendentes.length} ajustes pendentes de aprovação`);
      }

      // Criar ou atualizar período
      const { data, error } = await supabase
        .from('periodos_ponto')
        .upsert({
          competencia,
          data_inicio: dataInicio,
          data_fim: dataFim,
          status: 'fechado' as StatusPeriodo,
          fechado_em: new Date().toISOString(),
        }, { onConflict: 'competencia' })
        .select()
        .single();

      if (error) throw error;
      await auditoria.registrarCriacao('ajustes_ponto', data.id, { registro_ponto_id: ajuste.registro_ponto_id, tipo_ajuste: ajuste.tipo_ajuste });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['periodos-ponto'] });
      toast.success(`Período ${data.competencia} fechado com sucesso!`);
    },
    onError: (error) => {
      toast.error('Erro ao fechar período: ' + error.message);
    }
  });

  const reabrirPeriodoMutation = useMutation({
    mutationFn: async (competencia: string) => {
      const { data, error } = await supabase
        .from('periodos_ponto')
        .update({
          status: 'aberto' as StatusPeriodo,
          fechado_em: null,
          fechado_por: null,
        })
        .eq('competencia', competencia)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['periodos-ponto'] });
      toast.success(`Período ${data.competencia} reaberto!`);
    },
    onError: (error) => {
      toast.error('Erro ao reabrir período: ' + error.message);
    }
  });

  // ===== AJUSTES DE PONTO =====

  const solicitarAjusteMutation = useMutation({
    mutationFn: async (ajuste: Omit<AjustePonto, 'id' | 'created_at' | 'status' | 'aprovado_por' | 'aprovado_em'>) => {
      const { data, error } = await supabase
        .from('ajustes_ponto')
        .insert({
          ...ajuste,
          status: 'pendente' as StatusAjuste,
        })
        .select()
        .single();

      if (error) throw error;
      await auditoria.registrarCriacao('ajustes_ponto', data.id, { registro_ponto_id: ajuste.registro_ponto_id, tipo_ajuste: ajuste.tipo_ajuste });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ajustes-pendentes'] });
      toast.success('Ajuste solicitado! Aguardando aprovação.');
    },
    onError: (error) => {
      toast.error('Erro ao solicitar ajuste: ' + error.message);
    }
  });

  const aprovarAjusteMutation = useMutation({
    mutationFn: async ({ ajusteId, aprovado }: { ajusteId: string; aprovado: boolean }) => {
      // Buscar ajuste
      const { data: ajuste, error: errAjuste } = await supabase
        .from('ajustes_ponto')
        .select('*')
        .eq('id', ajusteId)
        .single();

      if (errAjuste) throw errAjuste;

      // Atualizar status do ajuste
      const { error: errUpdate } = await supabase
        .from('ajustes_ponto')
        .update({
          status: aprovado ? 'aprovado' : 'rejeitado' as StatusAjuste,
          aprovado_em: new Date().toISOString(),
        })
        .eq('id', ajusteId);

      if (errUpdate) throw errUpdate;

      // Se aprovado, aplicar a alteração no registro de ponto
      if (aprovado && ajuste.registro_ponto_id && ajuste.campo_alterado && ajuste.valor_novo !== undefined) {
        const { error: errPonto } = await supabase
          .from('registros_ponto')
          .update({ [ajuste.campo_alterado]: ajuste.valor_novo })
          .eq('id', ajuste.registro_ponto_id);

        if (errPonto) throw errPonto;
      }

      return { ajusteId, aprovado };
    },
    onSuccess: ({ aprovado }) => {
      queryClient.invalidateQueries({ queryKey: ['ajustes-pendentes'] });
      queryClient.invalidateQueries({ queryKey: ['registros-ponto'] });
      toast.success(aprovado ? 'Ajuste aprovado e aplicado!' : 'Ajuste rejeitado.');
    },
    onError: (error) => {
      toast.error('Erro ao processar ajuste: ' + error.message);
    }
  });

  // ===== CÁLCULO DE RESUMO =====

  const calcularResumoMensal = (registros: RegistroPonto[], jornadaSemanal: number = 44): ResumoMensal => {
    const jornadaDiaria = (jornadaSemanal / 6) * 60; // minutos
    
    let diasTrabalhados = 0;
    let diasUteis = 0;
    let totalTrabalhado = 0;
    let totalExtras50 = 0;
    let totalExtras100 = 0;
    let totalFalta = 0;
    let totalAtrasos = 0;

    registros.forEach(reg => {
      const data = parseISO(reg.data);
      const diaSemana = getDay(data);
      
      // Contar dias úteis (seg-sab)
      if (diaSemana !== 0) diasUteis++;

      if (reg.tipo_dia === 'normal' || reg.tipo_dia === 'feriado') {
        const trabalhado = intervalToMinutes(reg.horas_trabalhadas);
        const extras = intervalToMinutes(reg.horas_extras);
        const falta = intervalToMinutes(reg.horas_falta);

        if (trabalhado > 0) diasTrabalhados++;
        totalTrabalhado += trabalhado;

        // Separar extras 50% e 100%
        if (reg.tipo_dia === 'normal') {
          totalExtras50 += Math.min(extras, 120); // Primeiras 2h
          totalExtras100 += Math.max(0, extras - 120);
        } else {
          totalExtras100 += extras; // Feriado = 100%
        }

        totalFalta += falta;
      }
    });

    const horasPrevistas = diasUteis * jornadaDiaria;

    return {
      dias_trabalhados: diasTrabalhados,
      dias_uteis: diasUteis,
      horas_previstas: minutesToInterval(horasPrevistas),
      horas_trabalhadas: minutesToInterval(totalTrabalhado),
      horas_extras_50: minutesToInterval(totalExtras50),
      horas_extras_100: minutesToInterval(totalExtras100),
      horas_falta: minutesToInterval(totalFalta),
      atrasos: minutesToInterval(totalAtrasos),
      banco_horas_credito: '00:00',
      banco_horas_debito: '00:00',
      saldo_banco_horas: '00:00',
    };
  };

  // ===== RETORNO =====

  return {
    // Queries
    useRegistrosPonto,
    useRegistrosPeriodo,
    useFeriados,
    usePeriodos,
    useAjustesPendentes,
    useBancoHoras,
    
    // Mutations
    registrarPonto: registrarPontoMutation.mutate,
    registrarPontoAsync: registrarPontoMutation.mutateAsync,
    isRegistrando: registrarPontoMutation.isPending,
    
    // Importação
    importarArquivo,
    importProgress,
    
    // Período
    fecharPeriodo: fecharPeriodoMutation.mutate,
    reabrirPeriodo: reabrirPeriodoMutation.mutate,
    isFechandoPeriodo: fecharPeriodoMutation.isPending,
    
    // Ajustes
    solicitarAjuste: solicitarAjusteMutation.mutate,
    aprovarAjuste: aprovarAjusteMutation.mutate,
    isProcessandoAjuste: aprovarAjusteMutation.isPending,
    
    // Helpers
    calcularResumoMensal,
  };
};


