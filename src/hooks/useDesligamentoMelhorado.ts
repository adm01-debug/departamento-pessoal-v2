import { useState, useCallback } from 'react';
import { useAuditoriaIntegration } from './useAuditoriaIntegration';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  differenceInDays, differenceInMonths, differenceInYears,
  format, parseISO, addDays, startOfMonth, endOfMonth,
  getMonth, getYear, getDaysInMonth
} from 'date-fns';
import { calcularINSS, calcularIRRF } from '@/lib/calculosTrabalhistas';

// =====================================================
// TIPOS
// =====================================================

export type TipoDesligamento = 
  | 'sem_justa_causa'
  | 'justa_causa'
  | 'pedido_demissao'
  | 'acordo'
  | 'fim_contrato'
  | 'aposentadoria'
  | 'falecimento';

export type StatusDesligamento = 'em_andamento' | 'aguardando_homologacao' | 'concluido' | 'cancelado';

export interface Desligamento {
  id: string;
  colaborador_id: string;
  tipo: TipoDesligamento;
  data_desligamento: string;
  data_aviso?: string;
  aviso_previo_trabalhado: boolean;
  aviso_previo_indenizado: boolean;
  motivo?: string;
  status: StatusDesligamento;
  
  // Dados do colaborador no momento
  salario_base: number;
  media_variaveis?: number;
  
  // Verbas rescisórias
  saldo_salario: number;
  aviso_previo: number;
  aviso_previo_dias: number;
  ferias_vencidas: number;
  ferias_proporcionais: number;
  ferias_proporcionais_meses: number;
  terco_ferias_vencidas: number;
  terco_ferias_proporcionais: number;
  decimo_terceiro: number;
  decimo_terceiro_meses: number;
  
  // FGTS
  saldo_fgts: number;
  multa_fgts: number;
  multa_fgts_percentual: number;
  
  // Totais
  total_proventos: number;
  desconto_inss: number;
  desconto_irrf: number;
  desconto_aviso_previo?: number;
  outros_descontos?: number;
  total_descontos: number;
  valor_liquido: number;
  
  // Checklist
  checklist_comunicacao: boolean;
  checklist_documentacao: boolean;
  checklist_exame_demissional: boolean;
  checklist_calculo_rescisao: boolean;
  checklist_homologacao: boolean;
  checklist_guias_fgts: boolean;
  checklist_seguro_desemprego: boolean;
  checklist_revogacao_acessos: boolean;
  checklist_devolucao_equipamentos: boolean;
  checklist_baixa_ctps: boolean;
  checklist_esocial: boolean;
  checklist_pagamento: boolean;
  
  // Metadados
  created_at: string;
  created_by?: string;
  updated_at: string;
  concluido_em?: string;
  concluido_por?: string;
}

export interface CalculoRescisaoCompleto {
  // Identificação
  tipo: TipoDesligamento;
  tipoLabel: string;
  dataAdmissao: string;
  dataDesligamento: string;
  tempoServico: {
    anos: number;
    meses: number;
    dias: number;
    total_meses: number;
  };
  
  // Base de cálculo
  salarioBase: number;
  mediaVariaveis: number;
  remuneracaoMensal: number;
  
  // Saldo de salário
  saldoSalario: {
    dias: number;
    valor: number;
  };
  
  // Aviso prévio
  avisoPrevio: {
    dias: number;
    indenizado: boolean;
    valor: number;
    aplicavel: boolean;
  };
  
  // Férias
  feriasVencidas: {
    periodos: number;
    valor: number;
    terco: number;
  };
  feriasProporcionais: {
    meses: number;
    valor: number;
    terco: number;
    aplicavel: boolean;
  };
  
  // 13º salário
  decimoTerceiro: {
    meses: number;
    valor: number;
    aplicavel: boolean;
  };
  
  // FGTS
  fgts: {
    saldoEstimado: number;
    multaPercentual: number;
    multaValor: number;
    aplicavel: boolean;
  };
  
  // Totais
  totalProventos: number;
  
  // Descontos
  descontos: {
    inss: number;
    irrf: number;
    avisoPrevioNaoCumprido: number;
    outros: number;
    total: number;
  };
  
  // Líquido
  valorLiquido: number;
  
  // Direitos adicionais
  direitoSeguroDesemprego: boolean;
  direitoSaqueFGTS: boolean;
}

export interface DesligamentoComColaborador extends Desligamento {
  colaborador_nome?: string;
  colaborador_cargo?: string;
  colaborador_departamento?: string;
  colaborador_data_admissao?: string;
}

// =====================================================
// LABELS E CONFIGURAÇÕES
// =====================================================

export const tipoLabels: Record<TipoDesligamento, string> = {
  sem_justa_causa: 'Dispensa sem Justa Causa',
  justa_causa: 'Dispensa por Justa Causa',
  pedido_demissao: 'Pedido de Demissão',
  acordo: 'Acordo Mútuo (Art. 484-A CLT)',
  fim_contrato: 'Término de Contrato',
  aposentadoria: 'Aposentadoria',
  falecimento: 'Falecimento',
};

export const statusLabels: Record<StatusDesligamento, string> = {
  em_andamento: 'Em Andamento',
  aguardando_homologacao: 'Aguardando Homologação',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

// Direitos por tipo de desligamento
const direitosPorTipo: Record<TipoDesligamento, {
  saldoSalario: boolean;
  avisoPrevio: boolean;
  avisoPrevioPercentual: number;
  feriasVencidas: boolean;
  feriasProporcionais: boolean;
  decimoTerceiro: boolean;
  multaFgts: boolean;
  multaFgtsPercentual: number;
  saqueFgts: boolean;
  seguroDesemprego: boolean;
}> = {
  sem_justa_causa: {
    saldoSalario: true,
    avisoPrevio: true,
    avisoPrevioPercentual: 100,
    feriasVencidas: true,
    feriasProporcionais: true,
    decimoTerceiro: true,
    multaFgts: true,
    multaFgtsPercentual: 40,
    saqueFgts: true,
    seguroDesemprego: true,
  },
  justa_causa: {
    saldoSalario: true,
    avisoPrevio: false,
    avisoPrevioPercentual: 0,
    feriasVencidas: true,
    feriasProporcionais: false,
    decimoTerceiro: false,
    multaFgts: false,
    multaFgtsPercentual: 0,
    saqueFgts: false,
    seguroDesemprego: false,
  },
  pedido_demissao: {
    saldoSalario: true,
    avisoPrevio: false, // Pode ter desconto
    avisoPrevioPercentual: 0,
    feriasVencidas: true,
    feriasProporcionais: true,
    decimoTerceiro: true,
    multaFgts: false,
    multaFgtsPercentual: 0,
    saqueFgts: false,
    seguroDesemprego: false,
  },
  acordo: {
    saldoSalario: true,
    avisoPrevio: true,
    avisoPrevioPercentual: 50, // 50% do aviso
    feriasVencidas: true,
    feriasProporcionais: true,
    decimoTerceiro: true,
    multaFgts: true,
    multaFgtsPercentual: 20, // 20% da multa
    saqueFgts: true, // 80% do saldo
    seguroDesemprego: false,
  },
  fim_contrato: {
    saldoSalario: true,
    avisoPrevio: false,
    avisoPrevioPercentual: 0,
    feriasVencidas: true,
    feriasProporcionais: true,
    decimoTerceiro: true,
    multaFgts: false,
    multaFgtsPercentual: 0,
    saqueFgts: true,
    seguroDesemprego: false,
  },
  aposentadoria: {
    saldoSalario: true,
    avisoPrevio: false,
    avisoPrevioPercentual: 0,
    feriasVencidas: true,
    feriasProporcionais: true,
    decimoTerceiro: true,
    multaFgts: false,
    multaFgtsPercentual: 0,
    saqueFgts: true,
    seguroDesemprego: false,
  },
  falecimento: {
    saldoSalario: true,
    avisoPrevio: false,
    avisoPrevioPercentual: 0,
    feriasVencidas: true,
    feriasProporcionais: true,
    decimoTerceiro: true,
    multaFgts: true,
    multaFgtsPercentual: 40,
    saqueFgts: true,
    seguroDesemprego: false,
  },
};

// =====================================================
// FUNÇÃO DE CÁLCULO COMPLETO
// =====================================================

export function calcularRescisaoCompleta(
  salarioBase: number,
  dataAdmissao: Date | string,
  dataDesligamento: Date | string,
  tipo: TipoDesligamento,
  opcoes: {
    avisoPrevioTrabalhado?: boolean;
    mediaVariaveis?: number;
    periodosFerias?: number; // Períodos de férias vencidas não gozadas
    saldoFgts?: number;
    dependentesIRRF?: number;
  } = {}
): CalculoRescisaoCompleto {
  const admissao = typeof dataAdmissao === 'string' ? parseISO(dataAdmissao) : dataAdmissao;
  const desligamento = typeof dataDesligamento === 'string' ? parseISO(dataDesligamento) : dataDesligamento;
  
  const direitos = direitosPorTipo[tipo];
  const mediaVariaveis = opcoes.mediaVariaveis || 0;
  const remuneracaoMensal = salarioBase + mediaVariaveis;
  
  // Tempo de serviço
  const totalMeses = differenceInMonths(desligamento, admissao);
  const anos = Math.floor(totalMeses / 12);
  const meses = totalMeses % 12;
  const inicioUltimoMes = new Date(desligamento.getFullYear(), desligamento.getMonth(), admissao.getDate());
  const dias = differenceInDays(desligamento, inicioUltimoMes) + 1;
  
  // ===== SALDO DE SALÁRIO =====
  const diaNoMes = desligamento.getDate();
  const diasNoMes = getDaysInMonth(desligamento);
  const saldoSalarioValor = (remuneracaoMensal / 30) * diaNoMes;
  
  // ===== AVISO PRÉVIO =====
  // 30 dias + 3 dias por ano de serviço (máx 90 dias)
  const diasAvisoPrevio = Math.min(30 + (anos * 3), 90);
  let avisoPrevioValor = 0;
  let avisoPrevioAplicavel = direitos.avisoPrevio;
  
  if (avisoPrevioAplicavel && !opcoes.avisoPrevioTrabalhado) {
    avisoPrevioValor = (remuneracaoMensal / 30) * diasAvisoPrevio * (direitos.avisoPrevioPercentual / 100);
  }
  
  // Desconto de aviso prévio não cumprido (pedido de demissão)
  let descontoAvisoPrevio = 0;
  if (tipo === 'pedido_demissao' && !opcoes.avisoPrevioTrabalhado) {
    descontoAvisoPrevio = remuneracaoMensal; // 30 dias
  }
  
  // ===== FÉRIAS VENCIDAS =====
  const periodosFerias = opcoes.periodosFerias || (totalMeses >= 12 ? 1 : 0);
  const feriasVencidasValor = direitos.feriasVencidas ? remuneracaoMensal * periodosFerias : 0;
  const tercoFeriasVencidas = feriasVencidasValor / 3;
  
  // ===== FÉRIAS PROPORCIONAIS =====
  // Considera meses com 15+ dias trabalhados como mês cheio
  const mesesFeriasProporcionais = dias >= 15 ? meses + 1 : meses;
  let feriasProporcionaisValor = 0;
  let tercoFeriasProporcionais = 0;
  
  if (direitos.feriasProporcionais) {
    feriasProporcionaisValor = (remuneracaoMensal / 12) * Math.min(mesesFeriasProporcionais, 12);
    tercoFeriasProporcionais = feriasProporcionaisValor / 3;
  }
  
  // ===== 13º SALÁRIO =====
  // Meses trabalhados no ano (15+ dias conta como mês cheio)
  const mesAtual = getMonth(desligamento) + 1;
  const meses13 = dias >= 15 ? mesAtual : mesAtual - 1;
  let decimoTerceiroValor = 0;
  
  if (direitos.decimoTerceiro) {
    decimoTerceiroValor = (remuneracaoMensal / 12) * meses13;
  }
  
  // ===== FGTS =====
  // Estimativa de saldo: 8% x salário x meses
  const saldoFgtsEstimado = opcoes.saldoFgts || (remuneracaoMensal * 0.08 * totalMeses);
  let multaFgtsValor = 0;
  
  if (direitos.multaFgts) {
    multaFgtsValor = saldoFgtsEstimado * (direitos.multaFgtsPercentual / 100);
  }
  
  // ===== TOTAL PROVENTOS =====
  const totalProventos = 
    saldoSalarioValor +
    avisoPrevioValor +
    feriasVencidasValor +
    tercoFeriasVencidas +
    feriasProporcionaisValor +
    tercoFeriasProporcionais +
    decimoTerceiroValor +
    multaFgtsValor;
  
  // ===== DESCONTOS =====
  // INSS incide sobre: saldo salário + aviso prévio indenizado + 13º
  const baseINSS = saldoSalarioValor + (avisoPrevioValor > 0 ? avisoPrevioValor : 0) + decimoTerceiroValor;
  const resultadoINSS = calcularINSS(baseINSS);
  const descontoINSS = resultadoINSS.valorINSS;
  
  // IRRF incide sobre: base menos INSS
  const baseIRRF = baseINSS - descontoINSS;
  const resultadoIRRF = calcularIRRF(baseIRRF, descontoINSS, opcoes.dependentesIRRF || 0);
  const descontoIRRF = resultadoIRRF.valorIRRF;
  
  const totalDescontos = descontoINSS + descontoIRRF + descontoAvisoPrevio;
  
  // ===== LÍQUIDO =====
  const valorLiquido = totalProventos - totalDescontos;
  
  return {
    tipo,
    tipoLabel: tipoLabels[tipo],
    dataAdmissao: format(admissao, 'yyyy-MM-dd'),
    dataDesligamento: format(desligamento, 'yyyy-MM-dd'),
    tempoServico: {
      anos,
      meses,
      dias,
      total_meses: totalMeses,
    },
    salarioBase,
    mediaVariaveis,
    remuneracaoMensal,
    saldoSalario: {
      dias: diaNoMes,
      valor: saldoSalarioValor,
    },
    avisoPrevio: {
      dias: diasAvisoPrevio,
      indenizado: !opcoes.avisoPrevioTrabalhado,
      valor: avisoPrevioValor,
      aplicavel: avisoPrevioAplicavel,
    },
    feriasVencidas: {
      periodos: periodosFerias,
      valor: feriasVencidasValor,
      terco: tercoFeriasVencidas,
    },
    feriasProporcionais: {
      meses: mesesFeriasProporcionais,
      valor: feriasProporcionaisValor,
      terco: tercoFeriasProporcionais,
      aplicavel: direitos.feriasProporcionais,
    },
    decimoTerceiro: {
      meses: meses13,
      valor: decimoTerceiroValor,
      aplicavel: direitos.decimoTerceiro,
    },
    fgts: {
      saldoEstimado: saldoFgtsEstimado,
      multaPercentual: direitos.multaFgtsPercentual,
      multaValor: multaFgtsValor,
      aplicavel: direitos.multaFgts,
    },
    totalProventos,
    descontos: {
      inss: descontoINSS,
      irrf: descontoIRRF,
      avisoPrevioNaoCumprido: descontoAvisoPrevio,
      outros: 0,
      total: totalDescontos,
    },
    valorLiquido,
    direitoSeguroDesemprego: direitos.seguroDesemprego,
    direitoSaqueFGTS: direitos.saqueFgts,
  };
}

// =====================================================
// HOOK PRINCIPAL
// =====================================================

export function useDesligamentoMelhorado() {
  const queryClient = useQueryClient();
  const auditoria = useAuditoriaIntegration('colaborador');

  // Tipo para o resultado do join
  interface DesligamentoRow {
    id: string;
    colaborador_id: string;
    tipo: string;
    data_desligamento: string;
    data_aviso?: string;
    motivo?: string;
    status: string;
    salario_base: number;
    saldo_salario?: number;
    aviso_previo?: number;
    ferias_vencidas?: number;
    ferias_proporcionais?: number;
    terco_constitucional?: number;
    decimo_terceiro?: number;
    multa_fgts?: number;
    total_proventos?: number;
    total_descontos?: number;
    valor_liquido?: number;
    checklist_comunicacao?: boolean;
    checklist_documentacao?: boolean;
    checklist_calculo_rescisao?: boolean;
    checklist_homologacao?: boolean;
    checklist_revogacao_acessos?: boolean;
    checklist_devolucao_equipamentos?: boolean;
    checklist_esocial?: boolean;
    checklist_pagamento?: boolean;
    created_at: string;
    created_by?: string;
    updated_at: string;
    colaboradores?: {
      nome_completo?: string;
      cargo?: string;
      departamento?: string;
      data_admissao?: string;
    };
  }

  // ===== QUERIES =====

  const useDesligamentos = (filtros?: { status?: StatusDesligamento; ano?: number }) => {
    return useQuery({
      queryKey: ['desligamentos', filtros],
      queryFn: async () => {
        let query = supabase
          .from('desligamentos')
          .select(`
            *,
            colaboradores!inner(nome_completo, cargo, departamento, data_admissao)
          `)
          .order('created_at', { ascending: false ,
    staleTime: 5 * 60 * 1000,
    retry: 3});

        if (filtros?.status) {
          query = query.eq('status', filtros.status);
        }
        if (filtros?.ano) {
          query = query.gte('data_desligamento', `${filtros.ano}-01-01`)
                       .lte('data_desligamento', `${filtros.ano}-12-31`);
        }

        const { data, error } = await query;
        if (error) throw error;

        return (data || []).map((d: DesligamentoRow) => ({
          ...d,
          colaborador_nome: d.colaboradores?.nome_completo,
          colaborador_cargo: d.colaboradores?.cargo,
          colaborador_departamento: d.colaboradores?.departamento,
          colaborador_data_admissao: d.colaboradores?.data_admissao,
        })) as DesligamentoComColaborador[];
      },
    });
  };

  const useDesligamentoById = (id: string | null) => {
    return useQuery({
      queryKey: ['desligamento', id],
      queryFn: async () => {
        if (!id) return null;
        const { data, error } = await supabase
          .from('desligamentos')
          .select(`
            *,
            colaboradores!inner(nome_completo, cargo, departamento, data_admissao)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        
        const row = data as DesligamentoRow;
        return {
          ...row,
          colaborador_nome: row.colaboradores?.nome_completo,
          colaborador_cargo: row.colaboradores?.cargo,
          colaborador_departamento: row.colaboradores?.departamento,
          colaborador_data_admissao: row.colaboradores?.data_admissao,
        } as DesligamentoComColaborador;
      },
      enabled: !!id,
    });
  };

  // ===== RESUMO =====

  const useResumoDesligamentos = () => {
    return useQuery({
      queryKey: ['resumo-desligamentos'],
      queryFn: async () => {
        const anoAtual = new Date().getFullYear();
        
        const { data, error } = await supabase
          .from('desligamentos')
          .select('status, valor_liquido, tipo, data_desligamento')
          .gte('data_desligamento', `${anoAtual}-01-01`);

        if (error) throw error;

        const emAndamento = (data || []).filter(d => d.status === 'em_andamento').length;
        const concluidos = (data || []).filter(d => d.status === 'concluido');
        const totalPago = concluidos.reduce((acc, d) => acc + (d.valor_liquido || 0), 0);
        
        // Por tipo
        const porTipo: Record<TipoDesligamento, number> = {
          sem_justa_causa: 0,
          justa_causa: 0,
          pedido_demissao: 0,
          acordo: 0,
          fim_contrato: 0,
          aposentadoria: 0,
          falecimento: 0,
        };
        
        concluidos.forEach(d => {
          if (d.tipo && porTipo[d.tipo as TipoDesligamento] !== undefined) {
            porTipo[d.tipo as TipoDesligamento]++;
          }
        });

        return {
          emAndamento,
          concluidos: concluidos.length,
          totalPago,
          porTipo,
        };
      },
    });
  };

  // ===== MUTATIONS =====

  const criarDesligamentoMutation = useMutation({
    mutationFn: async (dados: {
      colaboradorId: string;
      tipo: TipoDesligamento;
      dataDesligamento: string;
      dataAviso?: string;
      avisoPrevioTrabalhado: boolean;
      motivo?: string;
      calculo: CalculoRescisaoCompleto;
    }) => {
      const { data, error } = await supabase
        .from('desligamentos')
        .insert([{
          colaborador_id: dados.colaboradorId,
          tipo: dados.tipo,
          data_desligamento: dados.dataDesligamento,
          data_aviso: dados.dataAviso,
          motivo: dados.motivo,
          status: 'em_andamento',
          
          salario_base: dados.calculo.salarioBase,
          
          saldo_salario: dados.calculo.saldoSalario.valor,
          aviso_previo: dados.calculo.avisoPrevio.valor,
          ferias_vencidas: dados.calculo.feriasVencidas.valor,
          ferias_proporcionais: dados.calculo.feriasProporcionais.valor,
          terco_constitucional: dados.calculo.feriasVencidas.terco + dados.calculo.feriasProporcionais.terco,
          decimo_terceiro: dados.calculo.decimoTerceiro.valor,
          
          multa_fgts: dados.calculo.fgts.multaValor,
          
          total_proventos: dados.calculo.totalProventos,
          total_descontos: dados.calculo.descontos.total,
          valor_liquido: dados.calculo.valorLiquido,
        }])
        .select()
        .single();

      if (error) throw error;

      // Atualizar status do colaborador para afastado (em processo de desligamento)
      await supabase
        .from('colaboradores')
        .update({ 
          status: 'afastado',
          data_desligamento: dados.dataDesligamento,
        })
        .eq('id', dados.colaboradorId);

      // ✅ AUDITORIA
      await auditoria.registrarCriacao(data.id, { colaborador_id: dados.colaboradorId, tipo: dados.tipo });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['desligamentos'] });
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] });
      queryClient.invalidateQueries({ queryKey: ['resumo-desligamentos'] });
      toast.success('Desligamento iniciado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar desligamento: ' + error.message);
    },
  });

  const atualizarChecklistMutation = useMutation({
    mutationFn: async ({ id, campo, valor }: { id: string; campo: string; valor: boolean }) => {
      const { error } = await supabase
        .from('desligamentos')
        .update({ [campo]: valor, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['desligamentos'] });
      queryClient.invalidateQueries({ queryKey: ['desligamento'] });
    },
  });

  const concluirDesligamentoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: desligamento } = await supabase
        .from('desligamentos')
        .select('colaborador_id')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('desligamentos')
        .update({
          status: 'concluido',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      // Atualizar colaborador para desligado
      if (desligamento?.colaborador_id) {
        await supabase
          .from('colaboradores')
          .update({ status: 'desligado' })
          .eq('id', desligamento.colaborador_id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['desligamentos'] });
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] });
      queryClient.invalidateQueries({ queryKey: ['resumo-desligamentos'] });
      toast.success('Desligamento concluído!');
    },
    onError: (error) => {
      toast.error('Erro ao concluir: ' + error.message);
    },
  });

  const cancelarDesligamentoMutation = useMutation({
    mutationFn: async ({ id, motivo }: { id: string; motivo: string }) => {
      const { data: desligamento } = await supabase
        .from('desligamentos')
        .select('colaborador_id')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('desligamentos')
        .update({
          status: 'cancelado',
          motivo: motivo,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      // Reverter status do colaborador
      if (desligamento?.colaborador_id) {
        await supabase
          .from('colaboradores')
          .update({ 
            status: 'ativo',
            data_desligamento: null,
          })
          .eq('id', desligamento.colaborador_id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['desligamentos'] });
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] });
      toast.success('Desligamento cancelado.');
    },
  });

  // ===== RETORNO =====

  return {
    // Queries
    useDesligamentos,
    useDesligamentoById,
    useResumoDesligamentos,
    
    // Mutations
    criarDesligamento: criarDesligamentoMutation.mutate,
    criarDesligamentoAsync: criarDesligamentoMutation.mutateAsync,
    isCriando: criarDesligamentoMutation.isPending,
    
    atualizarChecklist: atualizarChecklistMutation.mutate,
    concluirDesligamento: concluirDesligamentoMutation.mutate,
    cancelarDesligamento: cancelarDesligamentoMutation.mutate,
    
    // Helpers
    calcularRescisao: calcularRescisaoCompleta,
    tipoLabels,
    statusLabels,
    direitosPorTipo,
  };
}

