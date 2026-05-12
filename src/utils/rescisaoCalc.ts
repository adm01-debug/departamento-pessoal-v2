/**
 * Tabelas e Cálculos de Rescisão - Conformidade CLT 2026
 * Implementa cálculos de verbas rescisórias, descontos legais (INSS/IRRF) e multas.
 * Baseado na Lei 12.506/2011 (Aviso Prévio Proporcional) e Artigos 477 a 486 da CLT.
 */

import { calcularINSS, calcularIRRF } from '@/calculators/impostos';

/**
 * Calcula a quantidade de meses (avos) proporcionais entre duas datas.
 * Considera a regra da CLT: fração igual ou superior a 15 dias conta como mês integral.
 */
function calcularAvos(inicio: Date, fim: Date): number {
  let meses = (fim.getFullYear() - inicio.getFullYear()) * 12;
  meses += fim.getMonth() - inicio.getMonth();
  
  const diaInicio = inicio.getDate();
  const diaFim = fim.getDate();
  
  // Se o dia do fim é menor que o dia do início, o mês atual ainda não está completo
  if (diaFim < diaInicio - 1) {
    meses--;
  }
  
  // Cálculo dos dias restantes no último mês incompleto para ver se passa de 14 dias
  let dataReferencia = new Date(inicio.getFullYear(), inicio.getMonth() + meses, inicio.getDate());
  const diffTime = fim.getTime() - dataReferencia.getTime();
  const diasRestantes = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diasRestantes >= 15 ? meses + 1 : meses;
}

export interface RescisaoResult {
  saldoSalario: number;
  avisoIndenizado: number;
  feriasVencidas: number;
  feriasProporcionais: number;
  tercoFerias: number;
  decimoTerceiro: number;
  multaFGTS: number;
  fgtsRescisao: number;
  totalProventos: number;
  inss: number;
  irrf: number;
  totalDescontos: number;
  totalLiquido: number;
  diasTrabalhados: number;
  mesesFerias: number;
  meses13: number;
  diasAviso: number;
  detalhes?: string;
}

export interface RescisaoParams {
  salario: number;
  dataAdmissao: string;
  dataDesligamento: string;
  tipo: string;
  avisoTrabalhado: boolean;
  feriasVencidas: boolean;
  saldoFGTS: number;
  dependentes?: number;
}

/**
 * Motor de Cálculo CLT
 */
export function calcularRescisao(params: RescisaoParams): RescisaoResult {
  const { salario, dataAdmissao, dataDesligamento, tipo, avisoTrabalhado, feriasVencidas, saldoFGTS, dependentes = 0 } = params;
  const admissao = new Date(dataAdmissao);
  const desligamento = new Date(dataDesligamento);

  // 1. Saldo de Salário (Art. 4º CLT)
  const diasNoMes = new Date(desligamento.getFullYear(), desligamento.getMonth() + 1, 0).getDate();
  const diasTrabalhados = desligamento.getDate();
  const saldoSalario = Number(((salario / diasNoMes) * diasTrabalhados).toFixed(2));

  // 2. Aviso Prévio (Lei 12.506/2011)
  const diffAnos = Math.floor((desligamento.getTime() - admissao.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  const diasAviso = Math.min(90, 30 + (Math.max(0, diffAnos) * 3));
  
  // Projeção do aviso prévio para cálculos de avos (Súmula 305 TST)
  const dataFimProjetada = new Date(desligamento);
  if (tipo === 'sem_justa_causa' || tipo === 'acordo_mutuo') {
    dataFimProjetada.setDate(dataFimProjetada.getDate() + diasAviso);
  }

  let avisoIndenizado = 0;
  if (tipo === 'sem_justa_causa' && !avisoTrabalhado) {
    avisoIndenizado = Number(((salario / 30) * diasAviso).toFixed(2));
  } else if (tipo === 'acordo_mutuo' && !avisoTrabalhado) {
    avisoIndenizado = Number(((salario / 30) * (diasAviso / 2)).toFixed(2));
  }

  // 3. Férias (Art. 146 CLT) - Com projeção do aviso
  const mesesFerias = calcularAvos(admissao, dataFimProjetada);
  let feriasProporcionaisVal = 0;
  if (tipo !== 'justa_causa') {
    feriasProporcionaisVal = Number(((salario / 12) * (mesesFerias % 12 || (mesesFerias > 0 ? 12 : 0))).toFixed(2));
  }
  
  const feriasVencidasVal = feriasVencidas && tipo !== 'justa_causa' ? salario : 0;
  const tercoFerias = Number(((feriasProporcionaisVal + feriasVencidasVal) / 3).toFixed(2));

  // 4. 13º Salário (Lei 4.090/62) - Com projeção do aviso
  const inicioAno = new Date(dataFimProjetada.getFullYear(), 0, 1);
  const dataBase13 = admissao > inicioAno ? admissao : inicioAno;
  const meses13 = calcularAvos(dataBase13, dataFimProjetada);
  
  let decimoTerceiro = 0;
  if (tipo !== 'justa_causa' && tipo !== 'culpa_reciproca') {
    decimoTerceiro = Number(((salario / 12) * meses13).toFixed(2));
  } else if (tipo === 'culpa_reciproca') {
    decimoTerceiro = Number(((salario / 12) * meses13 / 2).toFixed(2));
  }

  // 5. FGTS e Multa (Art. 18 Lei 8.036/90)
  // O FGTS incide sobre o saldo de salário, 13º e aviso prévio indenizado
  const fgtsRescisao = Number(((saldoSalario + avisoIndenizado + decimoTerceiro) * 0.08).toFixed(2));
  let multaFGTS = 0;
  if (tipo === 'sem_justa_causa') {
    multaFGTS = Number(((saldoFGTS + fgtsRescisao) * 0.40).toFixed(2));
  } else if (tipo === 'acordo_mutuo') {
    multaFGTS = Number(((saldoFGTS + fgtsRescisao) * 0.20).toFixed(2));
  }

  // 6. Totais e Descontos
  const totalProventos = Number((saldoSalario + avisoIndenizado + feriasVencidasVal + feriasProporcionaisVal + tercoFerias + decimoTerceiro).toFixed(2));
  
  // INSS incide separadamente sobre Saldo Salário e 13º
  const inssSaldo = calcularINSS(saldoSalario);
  const inss13 = calcularINSS(decimoTerceiro);
  const inss = Number((inssSaldo + inss13).toFixed(2));
  
  // IRRF incide sobre base salarial (Saldo Salário - INSS) e 13º (exclusivo na fonte)
  const irrfSaldo = calcularIRRF(saldoSalario, dependentes, 0);
  const irrf13 = calcularIRRF(decimoTerceiro, 0, 0); // 13º geralmente não abate dependentes de novo se já abatidos no mensal
  const irrf = Number((irrfSaldo + irrf13).toFixed(2));
  
  const totalDescontos = Number((inss + irrf).toFixed(2));
  const totalLiquido = Number((totalProventos - totalDescontos + multaFGTS).toFixed(2));

  return {
    saldoSalario, 
    avisoIndenizado, 
    feriasVencidas: feriasVencidasVal, 
    feriasProporcionais: feriasProporcionaisVal,
    tercoFerias, 
    decimoTerceiro, 
    multaFGTS, 
    fgtsRescisao, 
    totalProventos, 
    inss, 
    irrf, 
    totalDescontos, 
    totalLiquido,
    diasTrabalhados, 
    mesesFerias, 
    meses13, 
    diasAviso,
  };
}

export function fmt(v: number) {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
