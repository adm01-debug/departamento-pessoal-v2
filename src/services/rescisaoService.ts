/**
 * @fileoverview Service para cálculos e operações de rescisão
 * @module services/rescisaoService
 * @version V8.1 - Implementação completa
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { calcularINSS, calcularIRRF, calcularFGTS, SALARIO_MINIMO } from '@/lib/calculosTrabalhistas';
import { differenceInDays, differenceInMonths, addDays, format, parseISO } from 'date-fns';

// ============================================
// TIPOS
// ============================================

export type TipoRescisao = 
  | 'sem_justa_causa'
  | 'com_justa_causa'
  | 'pedido_demissao'
  | 'acordo_mutuo'
  | 'culpa_reciproca'
  | 'fim_contrato'
  | 'falecimento';

export type StatusRescisao = 
  | 'rascunho'
  | 'calculada'
  | 'conferida'
  | 'aprovada'
  | 'homologada'
  | 'paga'
  | 'cancelada';

export interface Rescisao {
  id: string;
  colaborador_id: string;
  empresa_id: string;
  tipo: TipoRescisao;
  data_demissao: string;
  data_aviso: string;
  aviso_previo_trabalhado: boolean;
  aviso_previo_dias: number;
  motivo?: string;
  
  // Valores calculados
  saldo_salario: number;
  aviso_previo_valor: number;
  ferias_vencidas: number;
  ferias_proporcionais: number;
  terco_ferias: number;
  decimo_terceiro: number;
  multa_fgts: number;
  saque_fgts: number;
  total_proventos: number;
  
  // Descontos
  inss: number;
  irrf: number;
  aviso_desconto: number;
  outros_descontos: number;
  total_descontos: number;
  
  // Totais
  valor_liquido: number;
  
  status: StatusRescisao;
  data_pagamento?: string;
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DadosCalculoRescisao {
  colaboradorId: string;
  tipoRescisao: TipoRescisao;
  dataDemissao: string;
  avisoPrevioTrabalhado: boolean;
  feriasVencidasPeriodos: number;
  saldoFGTS: number;
  mediaVariaveis?: number;
}

export interface ResultadoCalculoRescisao {
  colaboradorId: string;
  tipo: TipoRescisao;
  dataDemissao: string;
  diasTrabalhados: number;
  anosCompletos: number;
  
  proventos: {
    saldoSalario: number;
    avisoPrevio: number;
    diasAvisoPrevio: number;
    feriasVencidas: number;
    feriasProporcionais: number;
    tercoFerias: number;
    decimoTerceiro: number;
    total: number;
  };
  
  descontos: {
    inss: number;
    irrf: number;
    avisoDesconto: number;
    total: number;
  };
  
  fgts: {
    saldo: number;
    multa: number;
    percentualMulta: number;
    saque: number;
    depositoRescisorio: number;
  };
  
  liquido: number;
  totalGeral: number;
}

// ============================================
// FUNÇÕES DE CÁLCULO
// ============================================

function calcularAvisoPrevioDias(dataAdmissao: Date, dataDemissao: Date): number {
  const meses = differenceInMonths(dataDemissao, dataAdmissao);
  const anos = Math.floor(meses / 12);
  return Math.min(30 + (anos * 3), 90);
}

function calcularFeriasRescisao(
  salario: number,
  dataAdmissao: Date,
  dataDemissao: Date,
  feriasVencidasPeriodos: number,
  diasProjecao: number
) {
  // Férias vencidas
  const feriasVencidas = salario * feriasVencidasPeriodos;
  
  // Férias proporcionais
  const meses = differenceInMonths(dataDemissao, dataAdmissao);
  let mesesProporcional = meses % 12;
  mesesProporcional += Math.floor(diasProjecao / 30);
  mesesProporcional = Math.min(mesesProporcional, 12);
  
  // Se trabalhou 15+ dias no mês, conta como mês cheio
  if (dataDemissao.getDate() >= 15) mesesProporcional++;
  
  const feriasProporcionais = (salario / 12) * Math.min(mesesProporcional, 12);
  const terco = (feriasVencidas + feriasProporcionais) / 3;
  
  return { feriasVencidas, feriasProporcionais, terco };
}

function calcular13Proporcional(salario: number, dataDemissao: Date, diasProjecao: number): number {
  let meses = dataDemissao.getMonth() + 1;
  meses += Math.floor(diasProjecao / 30);
  if (dataDemissao.getDate() >= 15) meses++;
  return (salario / 12) * Math.min(meses, 12);
}

function calcularMultaFGTS(saldoFGTS: number, tipo: TipoRescisao): { multa: number; percentual: number; saque: number } {
  switch (tipo) {
    case 'sem_justa_causa':
      return { multa: saldoFGTS * 0.40, percentual: 40, saque: saldoFGTS };
    case 'acordo_mutuo':
      return { multa: saldoFGTS * 0.20, percentual: 20, saque: saldoFGTS * 0.80 };
    case 'culpa_reciproca':
      return { multa: saldoFGTS * 0.20, percentual: 20, saque: saldoFGTS };
    case 'fim_contrato':
    case 'falecimento':
      return { multa: 0, percentual: 0, saque: saldoFGTS };
    default:
      return { multa: 0, percentual: 0, saque: 0 };
  }
}

// ============================================
// SERVICE
// ============================================

export const rescisaoService = {
  /**
   * Lista rescisões
   */
  async listar(filters?: { empresaId?: string; status?: StatusRescisao }): Promise<Rescisao[]> {
    try {
      let query = supabase
        .from('rescisoes')
        .select('*, colaborador:colaboradores(id, nome, cpf)');
      
      if (filters?.empresaId) query = query.eq('empresa_id', filters.empresaId);
      if (filters?.status) query = query.eq('status', filters.status);
      
      const { data, error } = await query.order('data_demissao', { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as Rescisao[];
    } catch (error) {
      logger.error('Erro ao listar rescisões:', error);
      throw error;
    }
  },

  /**
   * Busca rescisão por ID
   */
  async buscarPorId(id: string): Promise<Rescisao | null> {
    try {
      const { data, error } = await supabase
        .from('rescisoes')
        .select('*, colaborador:colaboradores(id, nome, cpf, salario, data_admissao)')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(error.message);
      }
      return data as Rescisao;
    } catch (error) {
      logger.error('Erro ao buscar rescisão:', error);
      throw error;
    }
  },

  /**
   * Calcula rescisão
   */
  async calcular(dados: DadosCalculoRescisao): Promise<ResultadoCalculoRescisao> {
    try {
      // Buscar dados do colaborador
      const { data: colaborador, error } = await supabase
        .from('colaboradores')
        .select('id, nome, salario, data_admissao, dependentes')
        .eq('id', dados.colaboradorId)
        .single();
      
      if (error || !colaborador) throw new Error('Colaborador não encontrado');
      
      const salario = colaborador.salario + (dados.mediaVariaveis || 0);
      const dataAdmissao = parseISO(colaborador.data_admissao);
      const dataDemissao = parseISO(dados.dataDemissao);
      
      const diasTrabalhados = differenceInDays(dataDemissao, dataAdmissao);
      const anosCompletos = Math.floor(diasTrabalhados / 365);
      
      // Saldo de salário
      const diasNoMes = dataDemissao.getDate();
      const saldoSalario = (salario / 30) * diasNoMes;
      
      // Aviso prévio
      const diasAvisoPrevio = calcularAvisoPrevioDias(dataAdmissao, dataDemissao);
      let avisoPrevioValor = 0;
      let avisoDesconto = 0;
      const diasProjecao = dados.avisoPrevioTrabalhado ? 0 : diasAvisoPrevio;
      
      if (!dados.avisoPrevioTrabalhado) {
        if (dados.tipoRescisao === 'sem_justa_causa') {
          avisoPrevioValor = (salario / 30) * diasAvisoPrevio;
        } else if (dados.tipoRescisao === 'pedido_demissao') {
          avisoDesconto = (salario / 30) * 30; // Desconta 30 dias
        } else if (dados.tipoRescisao === 'acordo_mutuo') {
          avisoPrevioValor = ((salario / 30) * diasAvisoPrevio) / 2;
        }
      }
      
      // Férias
      const ferias = dados.tipoRescisao !== 'com_justa_causa'
        ? calcularFeriasRescisao(salario, dataAdmissao, dataDemissao, dados.feriasVencidasPeriodos, diasProjecao)
        : { feriasVencidas: salario * dados.feriasVencidasPeriodos, feriasProporcionais: 0, terco: (salario * dados.feriasVencidasPeriodos) / 3 };
      
      // 13º
      const decimoTerceiro = dados.tipoRescisao !== 'com_justa_causa'
        ? calcular13Proporcional(salario, dataDemissao, diasProjecao)
        : 0;
      
      // FGTS
      const fgtsCalc = calcularMultaFGTS(dados.saldoFGTS, dados.tipoRescisao);
      const depositoRescisorio = (saldoSalario + avisoPrevioValor) * 0.08;
      
      // Total proventos
      const totalProventos = saldoSalario + avisoPrevioValor + 
        ferias.feriasVencidas + ferias.feriasProporcionais + ferias.terco + decimoTerceiro;
      
      // Descontos
      const verbasTriputaveis = saldoSalario + (dados.avisoPrevioTrabalhado ? 0 : 0);
      const inss = calcularINSS(verbasTriputaveis);
      const irrf = calcularIRRF(verbasTriputaveis, inss.valorINSS, colaborador.dependentes || 0);
      
      const totalDescontos = inss.valorINSS + irrf.valorIRRF + avisoDesconto;
      const liquido = totalProventos - totalDescontos;
      const totalGeral = liquido + fgtsCalc.saque + fgtsCalc.multa;
      
      return {
        colaboradorId: dados.colaboradorId,
        tipo: dados.tipoRescisao,
        dataDemissao: dados.dataDemissao,
        diasTrabalhados,
        anosCompletos,
        proventos: {
          saldoSalario: Math.round(saldoSalario * 100) / 100,
          avisoPrevio: Math.round(avisoPrevioValor * 100) / 100,
          diasAvisoPrevio,
          feriasVencidas: Math.round(ferias.feriasVencidas * 100) / 100,
          feriasProporcionais: Math.round(ferias.feriasProporcionais * 100) / 100,
          tercoFerias: Math.round(ferias.terco * 100) / 100,
          decimoTerceiro: Math.round(decimoTerceiro * 100) / 100,
          total: Math.round(totalProventos * 100) / 100,
        },
        descontos: {
          inss: inss.valorINSS,
          irrf: irrf.valorIRRF,
          avisoDesconto: Math.round(avisoDesconto * 100) / 100,
          total: Math.round(totalDescontos * 100) / 100,
        },
        fgts: {
          saldo: dados.saldoFGTS,
          multa: Math.round(fgtsCalc.multa * 100) / 100,
          percentualMulta: fgtsCalc.percentual,
          saque: Math.round(fgtsCalc.saque * 100) / 100,
          depositoRescisorio: Math.round(depositoRescisorio * 100) / 100,
        },
        liquido: Math.round(liquido * 100) / 100,
        totalGeral: Math.round(totalGeral * 100) / 100,
      };
    } catch (error) {
      logger.error('Erro ao calcular rescisão:', error);
      throw error;
    }
  },

  /**
   * Cria rescisão
   */
  async criar(dados: Partial<Rescisao>): Promise<Rescisao> {
    try {
      const { data, error } = await supabase
        .from('rescisoes')
        .insert([{ ...dados, status: 'rascunho', created_at: new Date().toISOString() }])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data as Rescisao;
    } catch (error) {
      logger.error('Erro ao criar rescisão:', error);
      throw error;
    }
  },

  /**
   * Atualiza rescisão
   */
  async atualizar(id: string, dados: Partial<Rescisao>): Promise<Rescisao> {
    try {
      const { data, error } = await supabase
        .from('rescisoes')
        .update({ ...dados, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data as Rescisao;
    } catch (error) {
      logger.error('Erro ao atualizar rescisão:', error);
      throw error;
    }
  },

  /**
   * Exclui rescisão
   */
  async excluir(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('rescisoes').delete().eq('id', id);
      if (error) throw new Error(error.message);
    } catch (error) {
      logger.error('Erro ao excluir rescisão:', error);
      throw error;
    }
  },
};

export default rescisaoService;
