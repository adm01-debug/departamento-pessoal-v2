// Calculadoras Trabalhistas Brasileiras 2026

// ===== TABELAS 2026 =====
const SALARIO_MINIMO_2026 = 1518;

const FAIXAS_INSS_2026 = [
  { limite: 1518.00, aliquota: 0.075 },
  { limite: 2793.88, aliquota: 0.09 },
  { limite: 5563.80, aliquota: 0.12 },
  { limite: 7786.93, aliquota: 0.14 },
];

const FAIXAS_IRRF_2026 = [
  { limite: 2259.20, aliquota: 0, deducao: 0 },
  { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { limite: Infinity, aliquota: 0.275, deducao: 896.00 },
];

const DEDUCAO_DEPENDENTE_IRRF = 189.59;
const ALIQUOTA_FGTS = 0.08;

// ===== INSS =====
export function calcularINSS(salarioBruto: number): number {
  let descontoTotal = 0;
  let baseRestante = salarioBruto;

  for (let i = 0; i < FAIXAS_INSS_2026.length; i++) {
    const faixa = FAIXAS_INSS_2026[i];
    const limiteAnterior = i === 0 ? 0 : FAIXAS_INSS_2026[i - 1].limite;
    const faixaCalculo = Math.min(baseRestante, faixa.limite - limiteAnterior);

    if (faixaCalculo <= 0) break;

    descontoTotal += faixaCalculo * faixa.aliquota;
    baseRestante -= faixaCalculo;
  }

  return Math.round(descontoTotal * 100) / 100;
}

// ===== IRRF =====
export function calcularIRRF(salarioBruto: number, dependentes: number = 0, outrasDeducoes: number = 0): number {
  const descontoINSS = calcularINSS(salarioBruto);
  const baseCalculo = salarioBruto - descontoINSS - (dependentes * DEDUCAO_DEPENDENTE_IRRF) - outrasDeducoes;

  if (baseCalculo <= 0) return 0;

  for (const faixa of FAIXAS_IRRF_2026) {
    if (baseCalculo <= faixa.limite) {
      const imposto = baseCalculo * faixa.aliquota - faixa.deducao;
      return Math.max(0, Math.round(imposto * 100) / 100);
    }
  }
  return 0;
}

// ===== FGTS =====
export function calcularFGTS(salarioBruto: number): number {
  return Math.round(salarioBruto * ALIQUOTA_FGTS * 100) / 100;
}

// ===== 13º SALÁRIO =====
export interface ParamsDecimo13 {
  salarioBase: number;
  mesesTrabalhados: number;
  mediasVariaveis?: number;
}

export function calcularDecimo13Proporcional(params: ParamsDecimo13): { bruto: number; inss: number; irrf: number; liquido: number } {
  const { salarioBase, mesesTrabalhados, mediasVariaveis = 0 } = params;
  const meses = Math.min(12, Math.max(0, mesesTrabalhados));
  const bruto = Math.round(((salarioBase + mediasVariaveis) / 12) * meses * 100) / 100;
  const inss = calcularINSS(bruto);
  const irrf = calcularIRRF(bruto);
  const liquido = Math.round((bruto - inss - irrf) * 100) / 100;
  return { bruto, inss, irrf, liquido };
}

// ===== FÉRIAS =====
export function calcularFerias(salarioBase: number, diasFerias: number = 30, diasAbono: number = 0) {
  const valorDiario = salarioBase / 30;
  const valorFerias = valorDiario * diasFerias;
  const tercoConstitucional = valorFerias / 3;
  const valorAbono = valorDiario * diasAbono;
  const tercoAbono = valorAbono / 3;
  const bruto = valorFerias + tercoConstitucional + valorAbono + tercoAbono;
  const inss = calcularINSS(bruto);
  const irrf = calcularIRRF(bruto);
  const liquido = Math.round((bruto - inss - irrf) * 100) / 100;

  return {
    valorFerias: Math.round(valorFerias * 100) / 100,
    tercoConstitucional: Math.round(tercoConstitucional * 100) / 100,
    valorAbono: Math.round(valorAbono * 100) / 100,
    tercoAbono: Math.round(tercoAbono * 100) / 100,
    bruto: Math.round(bruto * 100) / 100,
    inss,
    irrf,
    liquido,
  };
}

// ===== RESCISÃO =====
export type TipoRescisao = 'sem_justa_causa' | 'com_justa_causa' | 'pedido_demissao' | 'acordo_mutuo';

export function calcularRescisao(params: {
  salarioBase: number;
  dataAdmissao: string;
  dataDesligamento: string;
  tipoRescisao: TipoRescisao;
  saldoFGTS?: number;
  feriasVencidas?: boolean;
}) {
  const { salarioBase, dataAdmissao, dataDesligamento, tipoRescisao, saldoFGTS = 0, feriasVencidas = false } = params;
  const admissao = new Date(dataAdmissao);
  const desligamento = new Date(dataDesligamento);

  const diffMs = desligamento.getTime() - admissao.getTime();
  const totalDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalMeses = Math.floor(totalDias / 30);
  const diasNoMes = desligamento.getDate();

  // Saldo de salário
  const saldoSalario = Math.round((salarioBase / 30) * diasNoMes * 100) / 100;

  // 13º proporcional
  const mesAtual = desligamento.getMonth() + 1;
  const decimo13Prop = tipoRescisao !== 'com_justa_causa'
    ? Math.round((salarioBase / 12) * mesAtual * 100) / 100
    : 0;

  // Férias proporcionais
  const mesesFeriasProp = totalMeses % 12;
  const feriasProp = tipoRescisao !== 'com_justa_causa'
    ? Math.round((salarioBase / 12) * mesesFeriasProp * 100) / 100
    : 0;
  const tercoFeriasProp = Math.round(feriasProp / 3 * 100) / 100;

  // Férias vencidas
  const feriasVencidasValor = feriasVencidas ? salarioBase : 0;
  const tercoFeriasVencidas = Math.round(feriasVencidasValor / 3 * 100) / 100;

  // Aviso prévio
  const anosServico = Math.floor(totalMeses / 12);
  const diasAvisoPrevio = tipoRescisao === 'sem_justa_causa' ? Math.min(90, 30 + anosServico * 3) : 0;
  const avisoPrevio = tipoRescisao === 'sem_justa_causa'
    ? Math.round((salarioBase / 30) * diasAvisoPrevio * 100) / 100
    : tipoRescisao === 'acordo_mutuo'
      ? Math.round((salarioBase / 30) * Math.min(90, 30 + anosServico * 3) * 0.5 * 100) / 100
      : 0;

  // Multa FGTS
  const multaFGTS = tipoRescisao === 'sem_justa_causa'
    ? Math.round(saldoFGTS * 0.40 * 100) / 100
    : tipoRescisao === 'acordo_mutuo'
      ? Math.round(saldoFGTS * 0.20 * 100) / 100
      : 0;

  const totalBruto = saldoSalario + decimo13Prop + feriasProp + tercoFeriasProp + feriasVencidasValor + tercoFeriasVencidas + avisoPrevio;
  const inss = calcularINSS(saldoSalario);
  const irrf = calcularIRRF(saldoSalario);
  const totalLiquido = Math.round((totalBruto - inss - irrf) * 100) / 100;

  return {
    saldoSalario,
    decimo13Proporcional: decimo13Prop,
    feriasProporcional: feriasProp,
    tercoFeriasProporcional: tercoFeriasProp,
    feriasVencidas: feriasVencidasValor,
    tercoFeriasVencidas,
    avisoPrevio,
    diasAvisoPrevio,
    multaFGTS,
    totalBruto: Math.round(totalBruto * 100) / 100,
    inss,
    irrf,
    totalLiquido,
  };
}

// ===== ADICIONAL NOTURNO =====
export function calcularAdicionalNoturno(salarioBase: number, horasNoturnas: number, percentual: number = 20): number {
  const valorHora = salarioBase / 220;
  return Math.round(valorHora * (percentual / 100) * horasNoturnas * 100) / 100;
}

// ===== PERICULOSIDADE =====
export function calcularPericulosidade(salarioBase: number): number {
  return Math.round(salarioBase * 0.30 * 100) / 100;
}

// ===== INSALUBRIDADE =====
export type GrauInsalubridade = 'minimo' | 'medio' | 'maximo';
export function calcularInsalubridade(grau: GrauInsalubridade): number {
  const percentuais = { minimo: 0.10, medio: 0.20, maximo: 0.40 };
  return Math.round(SALARIO_MINIMO_2026 * percentuais[grau] * 100) / 100;
}

// ===== VALE TRANSPORTE =====
export function calcularDescontoVT(salarioBase: number, valorVT: number): number {
  const limiteDesconto = salarioBase * 0.06;
  return Math.round(Math.min(valorVT, limiteDesconto) * 100) / 100;
}

// ===== PENSÃO ALIMENTÍCIA =====
export function calcularPensaoAlimenticia(salarioLiquido: number, percentual: number): number {
  return Math.round(salarioLiquido * (percentual / 100) * 100) / 100;
}

// ===== SALÁRIO LÍQUIDO COMPLETO =====
export function calcularSalarioLiquido(params: {
  salarioBruto: number;
  dependentes?: number;
  outrasDeducoes?: number;
  valeTransporte?: number;
}) {
  const { salarioBruto, dependentes = 0, outrasDeducoes = 0, valeTransporte = 0 } = params;
  const inss = calcularINSS(salarioBruto);
  const irrf = calcularIRRF(salarioBruto, dependentes, outrasDeducoes);
  const fgts = calcularFGTS(salarioBruto);
  const descontoVT = valeTransporte > 0 ? calcularDescontoVT(salarioBruto, valeTransporte) : 0;

  const totalDescontos = inss + irrf + descontoVT;
  const liquido = Math.round((salarioBruto - totalDescontos) * 100) / 100;

  return { salarioBruto, inss, irrf, fgts, descontoVT, totalDescontos: Math.round(totalDescontos * 100) / 100, liquido };
}
