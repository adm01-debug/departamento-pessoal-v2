// Calculadoras Trabalhistas Brasileiras 2026

// ===== TABELAS 2026 =====
export const SALARIO_MINIMO_2026 = 1518;

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
    inss, irrf, liquido,
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

  const saldoSalario = Math.round((salarioBase / 30) * diasNoMes * 100) / 100;
  const mesAtual = desligamento.getMonth() + 1;
  const decimo13Prop = tipoRescisao !== 'com_justa_causa' ? Math.round((salarioBase / 12) * mesAtual * 100) / 100 : 0;
  const mesesFeriasProp = totalMeses % 12;
  const feriasProp = tipoRescisao !== 'com_justa_causa' ? Math.round((salarioBase / 12) * mesesFeriasProp * 100) / 100 : 0;
  const tercoFeriasProp = Math.round(feriasProp / 3 * 100) / 100;
  const feriasVencidasValor = feriasVencidas ? salarioBase : 0;
  const tercoFeriasVencidas = Math.round(feriasVencidasValor / 3 * 100) / 100;

  const anosServico = Math.floor(totalMeses / 12);
  const diasAvisoPrevio = tipoRescisao === 'sem_justa_causa' ? Math.min(90, 30 + anosServico * 3) : 0;
  const avisoPrevio = tipoRescisao === 'sem_justa_causa'
    ? Math.round((salarioBase / 30) * diasAvisoPrevio * 100) / 100
    : tipoRescisao === 'acordo_mutuo'
      ? Math.round((salarioBase / 30) * Math.min(90, 30 + anosServico * 3) * 0.5 * 100) / 100
      : 0;

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
    saldoSalario, decimo13Proporcional: decimo13Prop, feriasProporcional: feriasProp,
    tercoFeriasProporcional: tercoFeriasProp, feriasVencidas: feriasVencidasValor,
    tercoFeriasVencidas, avisoPrevio, diasAvisoPrevio, multaFGTS,
    totalBruto: Math.round(totalBruto * 100) / 100, inss, irrf, totalLiquido,
  };
}

// ===== HORAS EXTRAS =====
export function calcularHorasExtras(salarioBase: number, horasExtras50: number = 0, horasExtras100: number = 0): {
  valor50: number; valor100: number; total: number;
} {
  const valorHora = salarioBase / 220;
  const valor50 = Math.round(valorHora * 1.5 * horasExtras50 * 100) / 100;
  const valor100 = Math.round(valorHora * 2.0 * horasExtras100 * 100) / 100;
  return { valor50, valor100, total: Math.round((valor50 + valor100) * 100) / 100 };
}

// ===== DSR (Descanso Semanal Remunerado) =====
export function calcularDSR(totalVariaveis: number, diasUteis: number, domingosEFeriados: number): number {
  if (diasUteis <= 0) return 0;
  return Math.round((totalVariaveis / diasUteis) * domingosEFeriados * 100) / 100;
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

// ===== AVISO PRÉVIO INDENIZADO =====
export function calcularAvisoPrevioIndenizado(salarioBase: number, anosServico: number): {
  dias: number; valor: number;
} {
  const dias = Math.min(90, 30 + anosServico * 3);
  const valor = Math.round((salarioBase / 30) * dias * 100) / 100;
  return { dias, valor };
}

// ===== SEGURO DESEMPREGO =====
export function calcularSeguroDesemprego(ultimosSalarios: number[]): {
  valorParcela: number; parcelas: number;
} {
  const media = ultimosSalarios.reduce((a, b) => a + b, 0) / ultimosSalarios.length;

  let valorParcela: number;
  if (media <= 2041.39) {
    valorParcela = media * 0.8;
  } else if (media <= 3402.65) {
    valorParcela = 1633.10 + (media - 2041.39) * 0.5;
  } else {
    valorParcela = 2313.74;
  }

  valorParcela = Math.max(SALARIO_MINIMO_2026, Math.round(valorParcela * 100) / 100);
  return { valorParcela, parcelas: ultimosSalarios.length >= 24 ? 5 : ultimosSalarios.length >= 12 ? 4 : 3 };
}

// ===== PROVISÃO DE FÉRIAS =====
export function calcularProvisaoFerias(salarioBase: number, mesesAquisitivo: number): {
  provisaoFerias: number; provisaoTerco: number; provisaoEncargos: number; total: number;
} {
  const proporcional = (salarioBase / 12) * mesesAquisitivo;
  const provisaoFerias = Math.round(proporcional * 100) / 100;
  const provisaoTerco = Math.round(provisaoFerias / 3 * 100) / 100;
  const provisaoEncargos = Math.round((provisaoFerias + provisaoTerco) * 0.3637 * 100) / 100; // INSS patronal + FGTS
  const total = Math.round((provisaoFerias + provisaoTerco + provisaoEncargos) * 100) / 100;
  return { provisaoFerias, provisaoTerco, provisaoEncargos, total };
}

// ===== PROVISÃO DE 13º =====
export function calcularProvisao13(salarioBase: number, mesesTrabalhados: number): {
  provisao13: number; provisaoEncargos: number; total: number;
} {
  const provisao13 = Math.round((salarioBase / 12) * mesesTrabalhados * 100) / 100;
  const provisaoEncargos = Math.round(provisao13 * 0.3637 * 100) / 100;
  const total = Math.round((provisao13 + provisaoEncargos) * 100) / 100;
  return { provisao13, provisaoEncargos, total };
}

// ===== ENCARGOS TOTAIS =====
export function calcularEncargos(salarioBase: number): {
  inss: number; irrf: number; fgts: number; inssPatronal: number; rat: number;
  salarioEducacao: number; senai: number; sesi: number; totalEmpregado: number; totalEmpregador: number; custoTotal: number;
} {
  const inss = calcularINSS(salarioBase);
  const irrf = calcularIRRF(salarioBase);
  const fgts = calcularFGTS(salarioBase);
  const inssPatronal = Math.round(salarioBase * 0.20 * 100) / 100;
  const rat = Math.round(salarioBase * 0.03 * 100) / 100;
  const salarioEducacao = Math.round(salarioBase * 0.025 * 100) / 100;
  const senai = Math.round(salarioBase * 0.01 * 100) / 100;
  const sesi = Math.round(salarioBase * 0.015 * 100) / 100;
  const totalEmpregado = Math.round((inss + irrf) * 100) / 100;
  const totalEmpregador = Math.round((fgts + inssPatronal + rat + salarioEducacao + senai + sesi) * 100) / 100;
  const custoTotal = Math.round((salarioBase + totalEmpregador) * 100) / 100;

  return { inss, irrf, fgts, inssPatronal, rat, salarioEducacao, senai, sesi, totalEmpregado, totalEmpregador, custoTotal };
}

// ===== PRO RATA =====
export function calcularProRata(salarioBase: number, diasTrabalhados: number): number {
  return Math.round((salarioBase / 30) * diasTrabalhados * 100) / 100;
}

// ===== SOBREAVISO =====
export function calcularSobreaviso(salarioBase: number, horas: number): number {
  const valorHora = salarioBase / 220;
  return Math.round(valorHora * (1 / 3) * horas * 100) / 100;
}

// ===== PRONTIDÃO =====
export function calcularProntidao(salarioBase: number, horas: number): number {
  const valorHora = salarioBase / 220;
  return Math.round(valorHora * (2 / 3) * horas * 100) / 100;
}

// ===== GRATIFICAÇÃO =====
export function calcularGratificacao(salarioBase: number, percentual: number): number {
  return Math.round(salarioBase * (percentual / 100) * 100) / 100;
}

// ===== COMISSÃO =====
export function calcularComissao(valorVendas: number, percentualComissao: number): number {
  return Math.round(valorVendas * (percentualComissao / 100) * 100) / 100;
}

// ===== EMPRÉSTIMO CONSIGNADO =====
export function calcularMargemConsignado(salarioLiquido: number): {
  margemTotal: number; margemCartao: number;
} {
  return {
    margemTotal: Math.round(salarioLiquido * 0.35 * 100) / 100,
    margemCartao: Math.round(salarioLiquido * 0.05 * 100) / 100,
  };
}

// ===== MULTA 477 (atraso rescisão) =====
export function calcularMulta477(salarioBase: number): number {
  return salarioBase;
}

// ===== PLR =====
export function calcularPLR(valor: number): { bruto: number; irrf: number; liquido: number } {
  // PLR tem tabela progressiva própria
  const faixas = [
    { limite: 7640.80, aliquota: 0, deducao: 0 },
    { limite: 9922.28, aliquota: 0.075, deducao: 573.06 },
    { limite: 13167.00, aliquota: 0.15, deducao: 1316.36 },
    { limite: 16380.38, aliquota: 0.225, deducao: 2303.89 },
    { limite: Infinity, aliquota: 0.275, deducao: 3123.78 },
  ];

  let irrf = 0;
  for (const faixa of faixas) {
    if (valor <= faixa.limite) {
      irrf = Math.max(0, Math.round((valor * faixa.aliquota - faixa.deducao) * 100) / 100);
      break;
    }
  }

  return { bruto: valor, irrf, liquido: Math.round((valor - irrf) * 100) / 100 };
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

// ===== SALÁRIO MATERNIDADE =====
export function calcularSalarioMaternidade(salarioBase: number, diasLicenca: number = 120): number {
  return Math.round((salarioBase / 30) * diasLicenca * 100) / 100;
}

// ===== AUXÍLIO DOENÇA =====
export function calcularAuxilioDoenca(ultimosSalarios: number[]): number {
  if (ultimosSalarios.length === 0) return 0;
  const media = ultimosSalarios.reduce((a, b) => a + b, 0) / ultimosSalarios.length;
  const beneficio = media * 0.91;
  return Math.round(Math.max(SALARIO_MINIMO_2026, beneficio) * 100) / 100;
}

// ===== DIÁRIAS =====
export function calcularDiarias(valorDiaria: number, dias: number, percentualDesconto: number = 0): {
  total: number; desconto: number; liquido: number;
} {
  const total = Math.round(valorDiaria * dias * 100) / 100;
  const desconto = Math.round(total * (percentualDesconto / 100) * 100) / 100;
  return { total, desconto, liquido: Math.round((total - desconto) * 100) / 100 };
}

// ===== QUILOMETRAGEM =====
export function calcularQuilometragem(km: number, valorPorKm: number = 1.20): number {
  return Math.round(km * valorPorKm * 100) / 100;
}

// ===== BANCO DE HORAS =====
export function calcularBancoHoras(creditos: string[], debitos: string[]): {
  totalCreditos: number; totalDebitos: number; saldo: number; saldoFormatado: string;
} {
  const parseMinutos = (h: string) => {
    const [hh, mm] = h.split(':').map(Number);
    return (hh || 0) * 60 + (mm || 0);
  };
  const totalCreditos = creditos.reduce((a, c) => a + parseMinutos(c), 0);
  const totalDebitos = debitos.reduce((a, d) => a + parseMinutos(d), 0);
  const saldo = totalCreditos - totalDebitos;
  const horas = Math.floor(Math.abs(saldo) / 60);
  const minutos = Math.abs(saldo) % 60;
  const saldoFormatado = `${saldo < 0 ? '-' : ''}${horas}:${minutos.toString().padStart(2, '0')}`;
  return { totalCreditos, totalDebitos, saldo, saldoFormatado };
}
