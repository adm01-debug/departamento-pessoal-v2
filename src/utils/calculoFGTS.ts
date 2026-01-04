/**
 * Utilitário para cálculo de FGTS
 * @module utils/calculoFGTS
 */

export interface CalculoFGTSInput {
  salarioBruto: number;
  horasExtras?: number;
  valorHoraExtra?: number;
  adicionalNoturno?: number;
  comissoes?: number;
  gratificacoes?: number;
  descansoSemanalRemunerado?: number;
  avisoPrevioIndenizado?: boolean;
  decimoTerceiro?: boolean;
  ferias?: boolean;
}

export interface CalculoFGTSResult {
  baseCalculo: number;
  aliquota: number;
  valorFGTS: number;
  valorMultaRescisoria?: number;
  detalhamento: {
    componente: string;
    valor: number;
  }[];
}

/** Alíquota padrão do FGTS (8%) */
export const ALIQUOTA_FGTS = 0.08;

/** Alíquota para menor aprendiz (2%) */
export const ALIQUOTA_FGTS_APRENDIZ = 0.02;

/** Multa rescisória (40%) */
export const MULTA_RESCISORIA = 0.40;

/** Contribuição social (10% sobre multa) */
export const CONTRIBUICAO_SOCIAL = 0.10;

/**
 * Calcula o FGTS mensal
 */
export function calcularFGTSMensal(input: CalculoFGTSInput, aprendiz = false): CalculoFGTSResult {
  const detalhamento: { componente: string; valor: number }[] = [];

  // Base: Salário bruto
  detalhamento.push({ componente: "Salário Bruto", valor: input.salarioBruto });

  // Horas extras
  const horasExtrasValor = (input.horasExtras || 0) * (input.valorHoraExtra || 0);
  if (horasExtrasValor > 0) detalhamento.push({ componente: "Horas Extras", valor: horasExtrasValor });

  // Adicional noturno
  if (input.adicionalNoturno) detalhamento.push({ componente: "Adicional Noturno", valor: input.adicionalNoturno });

  // Comissões
  if (input.comissoes) detalhamento.push({ componente: "Comissões", valor: input.comissoes });

  // Gratificações
  if (input.gratificacoes) detalhamento.push({ componente: "Gratificações", valor: input.gratificacoes });

  // DSR
  if (input.descansoSemanalRemunerado) detalhamento.push({ componente: "DSR", valor: input.descansoSemanalRemunerado });

  // Calcula base
  const baseCalculo = detalhamento.reduce((sum, item) => sum + item.valor, 0);

  // Aplica alíquota
  const aliquota = aprendiz ? ALIQUOTA_FGTS_APRENDIZ : ALIQUOTA_FGTS;
  const valorFGTS = Math.round(baseCalculo * aliquota * 100) / 100;

  return { baseCalculo, aliquota, valorFGTS, detalhamento };
}

/**
 * Calcula multa rescisória do FGTS
 */
export function calcularMultaRescisoria(saldoFGTS: number, demissaoSemJustaCausa = true): number {
  if (!demissaoSemJustaCausa) return 0;
  return Math.round(saldoFGTS * MULTA_RESCISORIA * 100) / 100;
}

/**
 * Calcula FGTS sobre 13º salário
 */
export function calcularFGTSDecimoTerceiro(valorDecimoTerceiro: number, aprendiz = false): number {
  const aliquota = aprendiz ? ALIQUOTA_FGTS_APRENDIZ : ALIQUOTA_FGTS;
  return Math.round(valorDecimoTerceiro * aliquota * 100) / 100;
}

/**
 * Calcula FGTS sobre férias
 */
export function calcularFGTSFerias(valorFerias: number, tercoConstitucional: number, aprendiz = false): number {
  const aliquota = aprendiz ? ALIQUOTA_FGTS_APRENDIZ : ALIQUOTA_FGTS;
  const base = valorFerias + tercoConstitucional;
  return Math.round(base * aliquota * 100) / 100;
}

/**
 * Calcula projeção anual de FGTS
 */
export function calcularProjecaoAnualFGTS(salarioMensal: number, meses = 12): number {
  const fgtsMensal = salarioMensal * ALIQUOTA_FGTS;
  const fgtsDecimoTerceiro = salarioMensal * ALIQUOTA_FGTS;
  const feriasBase = (salarioMensal + (salarioMensal / 3)) * ALIQUOTA_FGTS;
  return Math.round((fgtsMensal * meses + fgtsDecimoTerceiro + feriasBase) * 100) / 100;
}

export default {
  calcularFGTSMensal,
  calcularMultaRescisoria,
  calcularFGTSDecimoTerceiro,
  calcularFGTSFerias,
  calcularProjecaoAnualFGTS,
  ALIQUOTA_FGTS,
  ALIQUOTA_FGTS_APRENDIZ,
  MULTA_RESCISORIA,
};
