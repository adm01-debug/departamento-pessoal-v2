// Cálculos de rescisão, provisões e encargos
import { SALARIO_MINIMO_2026 } from './tabelas';
import { calcularINSS, calcularIRRF, calcularFGTS } from './impostos';

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

export function calcularAvisoPrevioIndenizado(salarioBase: number, anosServico: number) {
  const dias = Math.min(90, 30 + anosServico * 3);
  const valor = Math.round((salarioBase / 30) * dias * 100) / 100;
  return { dias, valor };
}

export function calcularSeguroDesemprego(ultimosSalarios: number[]) {
  const media = ultimosSalarios.reduce((a, b) => a + b, 0) / ultimosSalarios.length;
  let valorParcela: number;
  if (media <= 2041.39) valorParcela = media * 0.8;
  else if (media <= 3402.65) valorParcela = 1633.10 + (media - 2041.39) * 0.5;
  else valorParcela = 2313.74;
  valorParcela = Math.max(SALARIO_MINIMO_2026, Math.round(valorParcela * 100) / 100);
  return { valorParcela, parcelas: ultimosSalarios.length >= 24 ? 5 : ultimosSalarios.length >= 12 ? 4 : 3 };
}

export function calcularMultaFGTS(saldoFGTS: number, tipo: 'sem_justa_causa' | 'acordo_mutuo'): number {
  const percentual = tipo === 'sem_justa_causa' ? 0.40 : 0.20;
  return Math.round(saldoFGTS * percentual * 100) / 100;
}

export function calcularMulta477(salarioBase: number): number {
  return salarioBase;
}

export function calcularProvisaoFerias(salarioBase: number, mesesAquisitivo: number) {
  const proporcional = (salarioBase / 12) * mesesAquisitivo;
  const provisaoFerias = Math.round(proporcional * 100) / 100;
  const provisaoTerco = Math.round(provisaoFerias / 3 * 100) / 100;
  const provisaoEncargos = Math.round((provisaoFerias + provisaoTerco) * 0.3637 * 100) / 100;
  const total = Math.round((provisaoFerias + provisaoTerco + provisaoEncargos) * 100) / 100;
  return { provisaoFerias, provisaoTerco, provisaoEncargos, total };
}

export function calcularProvisao13(salarioBase: number, mesesTrabalhados: number) {
  const provisao13 = Math.round((salarioBase / 12) * mesesTrabalhados * 100) / 100;
  const provisaoEncargos = Math.round(provisao13 * 0.3637 * 100) / 100;
  const total = Math.round((provisao13 + provisaoEncargos) * 100) / 100;
  return { provisao13, provisaoEncargos, total };
}

export function calcularEncargos(salarioBase: number, percentualRAT: number = 0.03, percentualTerceiros: number = 0.058) {
  const inssEmpregado = calcularINSS(salarioBase);
  const irrfEmpregado = calcularIRRF(salarioBase);
  const fgts = calcularFGTS(salarioBase);
  
  const inssPatronal = Math.round(salarioBase * 0.20 * 100) / 100;
  const rat = Math.round(salarioBase * percentualRAT * 100) / 100;
  const terceiros = Math.round(salarioBase * percentualTerceiros * 100) / 100;
  
  const totalEncargosPatronais = Math.round((inssPatronal + rat + terceiros + fgts) * 100) / 100;
  const custoMensalTotal = Math.round((salarioBase + totalEncargosPatronais) * 100) / 100;
  
  return {
    inssEmpregado,
    irrfEmpregado,
    fgts,
    inssPatronal,
    rat,
    terceiros,
    totalEncargosPatronais,
    custoMensalTotal
  };
}

export function calcularProRata(salarioBase: number, diasTrabalhados: number): number {
  return Math.round((salarioBase / 30) * diasTrabalhados * 100) / 100;
}

export function calcularMargemConsignado(salarioLiquido: number) {
  return {
    margemTotal: Math.round(salarioLiquido * 0.35 * 100) / 100,
    margemCartao: Math.round(salarioLiquido * 0.05 * 100) / 100,
  };
}

export function calcularPLR(valor: number) {
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
