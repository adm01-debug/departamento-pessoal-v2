/**
 * Cálculos relacionados ao FGTS (Fundo de Garantia do Tempo de Serviço)
 * Legislação: Lei 8.036/90 e atualizações
 */

// Alíquota padrão do FGTS (8%)
const ALIQUOTA_FGTS = 0.08;

// Alíquota FGTS para aprendiz (2%)
const ALIQUOTA_FGTS_APRENDIZ = 0.02;

// Multa rescisória (40% sobre saldo)
const MULTA_RESCISORIA = 0.40;

// Multa rescisória contribuição social (10%)
const MULTA_CONTRIBUICAO_SOCIAL = 0.10;

export interface CalculoFGTSInput {
  salarioBruto: number;
  horasExtras?: number;
  adicionalNoturno?: number;
  comissoes?: number;
  gratificacoes?: number;
  insalubridade?: number;
  periculosidade?: number;
  dsr?: number;
  tipoContrato?: "clt" | "aprendiz" | "domestico";
}

export interface CalculoFGTSOutput {
  baseCalculo: number;
  aliquota: number;
  valorMensal: number;
  valorAnual: number;
  valor13Salario: number;
  depositoFerias: number;
}

export interface MultaRescissoriaOutput {
  saldoFGTS: number;
  multa40: number;
  contribuicaoSocial10: number;
  totalMulta: number;
  totalAReceber: number;
}

/**
 * Calcula a base de cálculo do FGTS
 * Inclui todas as verbas de natureza salarial
 */
export function calcularBaseFGTS(dados: CalculoFGTSInput): number {
  const {
    salarioBruto,
    horasExtras = 0,
    adicionalNoturno = 0,
    comissoes = 0,
    gratificacoes = 0,
    insalubridade = 0,
    periculosidade = 0,
    dsr = 0
  } = dados;

  return salarioBruto + horasExtras + adicionalNoturno + comissoes + gratificacoes + insalubridade + periculosidade + dsr;
}

/**
 * Calcula o FGTS mensal
 */
export function calcularFGTSMensal(dados: CalculoFGTSInput): CalculoFGTSOutput {
  const baseCalculo = calcularBaseFGTS(dados);
  const aliquota = dados.tipoContrato === "aprendiz" ? ALIQUOTA_FGTS_APRENDIZ : ALIQUOTA_FGTS;
  const valorMensal = baseCalculo * aliquota;

  return {
    baseCalculo,
    aliquota: aliquota * 100,
    valorMensal: Math.round(valorMensal * 100) / 100,
    valorAnual: Math.round(valorMensal * 12 * 100) / 100,
    valor13Salario: Math.round(baseCalculo * aliquota * 100) / 100,
    depositoFerias: Math.round((baseCalculo + baseCalculo / 3) * aliquota * 100) / 100
  };
}

/**
 * Calcula a multa rescisória do FGTS (demissão sem justa causa)
 */
export function calcularMultaRescissoria(saldoFGTS: number, incluirContribuicaoSocial: boolean = true): MultaRescissoriaOutput {
  const multa40 = saldoFGTS * MULTA_RESCISORIA;
  const contribuicaoSocial10 = incluirContribuicaoSocial ? saldoFGTS * MULTA_CONTRIBUICAO_SOCIAL : 0;
  const totalMulta = multa40 + contribuicaoSocial10;

  return {
    saldoFGTS: Math.round(saldoFGTS * 100) / 100,
    multa40: Math.round(multa40 * 100) / 100,
    contribuicaoSocial10: Math.round(contribuicaoSocial10 * 100) / 100,
    totalMulta: Math.round(totalMulta * 100) / 100,
    totalAReceber: Math.round((saldoFGTS + multa40) * 100) / 100
  };
}

/**
 * Projeta o saldo de FGTS ao longo do tempo
 */
export function projetarSaldoFGTS(salarioBase: number, meses: number, saldoInicial: number = 0): number {
  const depositoMensal = salarioBase * ALIQUOTA_FGTS;
  const depositos13 = Math.floor(meses / 12) * (salarioBase * ALIQUOTA_FGTS);
  const depositosFerias = Math.floor(meses / 12) * ((salarioBase + salarioBase / 3) * ALIQUOTA_FGTS);
  
  return Math.round((saldoInicial + (depositoMensal * meses) + depositos13 + depositosFerias) * 100) / 100;
}

/**
 * Calcula FGTS sobre férias
 */
export function calcularFGTSFerias(salarioBase: number, diasFerias: number = 30): number {
  const valorFerias = (salarioBase / 30) * diasFerias;
  const tercoConstitucional = valorFerias / 3;
  const baseFGTS = valorFerias + tercoConstitucional;
  return Math.round(baseFGTS * ALIQUOTA_FGTS * 100) / 100;
}

/**
 * Calcula FGTS sobre 13º salário
 */
export function calcularFGTS13Salario(salarioBase: number, mesesTrabalhados: number = 12): number {
  const valor13 = (salarioBase / 12) * Math.min(mesesTrabalhados, 12);
  return Math.round(valor13 * ALIQUOTA_FGTS * 100) / 100;
}

/**
 * Calcula FGTS proporcional (rescisão)
 */
export function calcularFGTSProporcional(salarioBase: number, diasTrabalhados: number): number {
  const salarioProporcional = (salarioBase / 30) * diasTrabalhados;
  return Math.round(salarioProporcional * ALIQUOTA_FGTS * 100) / 100;
}

export default {
  calcularBaseFGTS,
  calcularFGTSMensal,
  calcularMultaRescissoria,
  projetarSaldoFGTS,
  calcularFGTSFerias,
  calcularFGTS13Salario,
  calcularFGTSProporcional,
  ALIQUOTA_FGTS,
  ALIQUOTA_FGTS_APRENDIZ,
  MULTA_RESCISORIA
};
