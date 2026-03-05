// @ts-nocheck
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { useAuditoriaIntegration } from './useAuditoriaIntegration';

interface ResumoIntegracao {
  colaboradorId: string;
  colaboradorNome: string;
  horasExtras50: number; // em minutos
  horasExtras100: number; // em minutos
  horasFalta: number; // em minutos
  diasFalta: number;
  atrasos: number; // em minutos
  valorHorasExtras50: number;
  valorHorasExtras100: number;
  valorFaltas: number;
  valorAtrasos: number;
}

// Converter interval do Postgres para minutos
const intervalToMinutes = (interval: string | null): number => {
  if (!interval) return 0;
  const match = interval.match(/(\d+):(\d+)/);
  if (match) {
    return parseInt(match[1]) * 60 + parseInt(match[2]);
  }
  return 0;
};

export interface UseIntegracaoPontoFolhaReturn {
  processarPonto: (colaboradorId: string, mes: number, ano: number) => Promise<ProcessamentoPonto>;
  exportarParaFolha: (params: { colaboradorId: string; mes: number; ano: number; processamento: ProcessamentoPonto }) => void;
  exportarParaFolhaAsync: (params: { colaboradorId: string; mes: number; ano: number; processamento: ProcessamentoPonto }) => Promise<unknown>;
  isExportando: boolean;
}

export const useIntegracaoPontoFolha = (): UseIntegracaoPontoFolhaReturn => {
  const queryClient = useQueryClient();

  // Processar registros de ponto e gerar resumo
  const processarPonto = async (competencia: string): Promise<ResumoIntegracao[]> => {
    const [ano, mes] = competencia.split('-').map(Number);
    const dataInicio = format(startOfMonth(new Date(ano, mes - 1)), 'yyyy-MM-dd');
    const dataFim = format(endOfMonth(new Date(ano, mes - 1)), 'yyyy-MM-dd');

    // Buscar colaboradores ativos
    const { data: colaboradores, error: errColabs } = await supabase
      .from('colaboradores')
      .select('id, nome_completo, salario_base, jornada_semanal')
      .eq('status', 'ativo');

    if (errColabs) throw errColabs;

    const resumos: ResumoIntegracao[] = [];

    for (const colab of colaboradores ?? []) {
      // Buscar registros de ponto do colaborador
      const { data: registros, error: errReg } = await supabase
        .from('registros_ponto')
        .select('id, colaborador_id, mes, ano, horas')
        .eq('colaborador_id', colab.id)
        .gte('data', dataInicio)
        .lte('data', dataFim);

      if (errReg) throw errReg;

      let totalExtras50 = 0;
      let totalExtras100 = 0;
      let totalFalta = 0;
      let diasFalta = 0;

      (registros ?? []).forEach((reg: unknown) => {
        const extras = intervalToMinutes(reg.horas_extras as string);
        const falta = intervalToMinutes(reg.horas_falta as string);
        const horasTrabalhadas = intervalToMinutes(reg.horas_trabalhadas as string);

        if (reg.tipo_dia === 'normal') {
          // Primeiras 2h = 50%, restante = 100%
          if (extras > 0) {
            totalExtras50 += Math.min(extras, 120);
            totalExtras100 += Math.max(0, extras - 120);
          }
          totalFalta += falta;
          if (!reg.entrada_1) {
            diasFalta++;
          }
        } else if (['feriado', 'folga'].includes(reg.tipo_dia) && reg.entrada_1) {
          // Trabalho em feriado/folga = 100%
          totalExtras100 += horasTrabalhadas;
        } else if (reg.tipo_dia === 'falta') {
          diasFalta++;
          totalFalta += falta;
        }
      });

      // Calcular valores
      const jornadaMensal = (colab.jornada_semanal || 44) * 4.5; // horas por mês
      const valorHora = colab.salario_base / jornadaMensal;
      const valorMinuto = valorHora / 60;

      resumos.push({
        colaboradorId: colab.id,
        colaboradorNome: colab.nome_completo,
        horasExtras50: totalExtras50,
        horasExtras100: totalExtras100,
        horasFalta: totalFalta,
        diasFalta,
        atrasos: 0,
        valorHorasExtras50: Math.round(totalExtras50 * valorMinuto * 1.5 * 100) / 100,
        valorHorasExtras100: Math.round(totalExtras100 * valorMinuto * 2 * 100) / 100,
        valorFaltas: Math.round((totalFalta / 60) * valorHora * 100) / 100,
        valorAtrasos: 0
      });
    }

    return resumos.filter(r => 
      r.horasExtras50 > 0 || r.horasExtras100 > 0 || r.horasFalta > 0 || r.diasFalta > 0
    );
  };

  // Buscar rubricas necessárias
  const buscarRubricas = async () => {
    const { data, error } = await supabase
      .from('rubricas_folha')
      .select('id, colaborador_id, mes, ano, horas')
      .in('codigo', ['1003', '1004', '2001', '2002'])
      .eq('ativo', true);

    if (error) throw error;

    return {
      horaExtra50: data?.find(r => r.codigo === '1003'),
      horaExtra100: data?.find(r => r.codigo === '1004'),
      falta: data?.find(r => r.codigo === '2001'),
      atraso: data?.find(r => r.codigo === '2002')
    };
  };

  // Exportar para eventos variáveis
  const exportarParaFolhaMutation = useMutation({
    mutationFn: async (competencia: string) => {
      logger.log('Iniciando integração Ponto x Folha para', competencia);
      
      // Processar registros de ponto
      const resumos = await processarPonto(competencia);
      logger.log('Resumos processados:', resumos.length);

      if (resumos.length === 0) {
        throw new Error('Nenhum registro de ponto encontrado para integração');
      }

      // Buscar rubricas
      const rubricas = await buscarRubricas();
      logger.log('Rubricas encontradas:', rubricas);

      // Remover eventos variáveis existentes da competência (para não duplicar)
      await supabase
        .from('eventos_variaveis')
        .delete()
        .eq('competencia', competencia)
        .in('rubrica_id', [
          rubricas.horaExtra50?.id,
          rubricas.horaExtra100?.id,
          rubricas.falta?.id,
          rubricas.atraso?.id
        ].filter(Boolean));

      // Preparar eventos variáveis
      const eventos: unknown[] = [];

      for (const resumo of resumos) {
        // Horas extras 50%
        if (resumo.horasExtras50 > 0 && rubricas.horaExtra50) {
          eventos.push({
            colaborador_id: resumo.colaboradorId,
            competencia,
            rubrica_id: rubricas.horaExtra50.id,
            valor: resumo.valorHorasExtras50,
            referencia: Math.round(resumo.horasExtras50 / 60 * 100) / 100, // em horas
            observacao: `Importado do controle de ponto - ${Math.round(resumo.horasExtras50 / 60 * 100) / 100}h`
          });
        }

        // Horas extras 100%
        if (resumo.horasExtras100 > 0 && rubricas.horaExtra100) {
          eventos.push({
            colaborador_id: resumo.colaboradorId,
            competencia,
            rubrica_id: rubricas.horaExtra100.id,
            valor: resumo.valorHorasExtras100,
            referencia: Math.round(resumo.horasExtras100 / 60 * 100) / 100,
            observacao: `Importado do controle de ponto - ${Math.round(resumo.horasExtras100 / 60 * 100) / 100}h`
          });
        }

        // Faltas
        if (resumo.horasFalta > 0 && rubricas.falta) {
          eventos.push({
            colaborador_id: resumo.colaboradorId,
            competencia,
            rubrica_id: rubricas.falta.id,
            valor: resumo.valorFaltas,
            referencia: resumo.diasFalta > 0 ? resumo.diasFalta : Math.round(resumo.horasFalta / 60 * 100) / 100,
            observacao: `Importado do controle de ponto - ${resumo.diasFalta} dia(s) / ${Math.round(resumo.horasFalta / 60 * 100) / 100}h`
          });
        }
      }

      logger.log('Eventos a inserir:', eventos.length);

      // Inserir eventos
      if (eventos.length > 0) {
        const { error } = await supabase
          .from('eventos_variaveis')
          .insert(eventos);

        if (error) throw error;
      }

      return {
        colaboradoresProcessados: resumos.length,
        eventosGerados: eventos.length,
        resumos
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['eventos-variaveis'] });
      queryClient.invalidateQueries({ queryKey: ['folhas'] });
      toast.success(`Integração concluída! ${data.colaboradoresProcessados} colaboradores, ${data.eventosGerados} eventos gerados.`);
    },
    onError: (error) => {
      logger.error('Erro na integração:', error);
      toast.error('Erro na integração: ' + error.message);
    }
  });

  return {
    processarPonto,
    exportarParaFolha: exportarParaFolhaMutation.mutate,
    exportarParaFolhaAsync: exportarParaFolhaMutation.mutateAsync,
    isExportando: exportarParaFolhaMutation.isPending
  };
};

// Formato de minutos para exibição
export const formatarMinutos = (minutos: number): string => {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `${horas}h${mins > 0 ? ` ${mins}min` : ''}`;
};








