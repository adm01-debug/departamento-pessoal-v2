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
  const ultimoDiaMes = new Date(desligamento.getFullYear(), desligamento.getMonth() + 1, 0).getDate();
  const diasTrabalhados = desligamento.getDate();
  const saldoSalario = Number(((salario / 30) * diasTrabalhados).toFixed(2));

  // 2. Aviso Prévio (Lei 12.506/2011)
  const diffTime = Math.abs(desligamento.getTime() - admissao.getTime());
  const anosCompletos = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
  const diasAviso = Math.min(90, 30 + (anosCompletos * 3));
  
  let avisoIndenizado = 0;
  if (tipo === 'sem_justa_causa' && !avisoTrabalhado) {
    avisoIndenizado = Number(((salario / 30) * diasAviso).toFixed(2));
  } else if (tipo === 'acordo_mutuo' && !avisoTrabalhado) {
    avisoIndenizado = Number(((salario / 30) * (diasAviso / 2)).toFixed(2));
  }

  // 3. Férias (Art. 146 CLT)
  const calcularAvosFerias = () => {
    let meses = (desligamento.getFullYear() - admissao.getFullYear()) * 12;
    meses += desligamento.getMonth() - admissao.getMonth();
    const diaAdmissao = admissao.getDate();
    const diaDesligamento = desligamento.getDate();
    
    let avos = meses % 12;
    const diasIncompleto = diaDesligamento >= diaAdmissao 
      ? diaDesligamento - diaAdmissao 
      : (new Date(desligamento.getFullYear(), desligamento.getMonth(), 0).getDate() - diaAdmissao) + diaDesligamento;

    return diasIncompleto >= 15 ? avos + 1 : avos;
  };
  
  const mesesFerias = calcularAvosFerias();
  let feriasProporcionaisVal = 0;
  if (tipo !== 'justa_causa') {
    feriasProporcionaisVal = Number(((salario / 12) * mesesFerias).toFixed(2));
  }
  
  const feriasVencidasVal = feriasVencidas && tipo !== 'justa_causa' ? salario : 0;
  const tercoFerias = Number(((feriasProporcionaisVal + feriasVencidasVal) / 3).toFixed(2));

  // 4. 13º Salário (Lei 4.090/62)
  const meses13 = desligamento.getDate() >= 15 ? desligamento.getMonth() + 1 : desligamento.getMonth();
  let decimoTerceiro = 0;
  if (tipo !== 'justa_causa' && tipo !== 'culpa_reciproca') {
    decimoTerceiro = Number(((salario / 12) * meses13).toFixed(2));
  } else if (tipo === 'culpa_reciproca') {
    decimoTerceiro = Number(((salario / 12) * meses13 / 2).toFixed(2));
  }

  // 5. FGTS e Multa (Art. 18 Lei 8.036/90)
  const fgtsRescisao = Number(((saldoSalario + avisoIndenizado + decimoTerceiro) * 0.08).toFixed(2));
  let multaFGTS = 0;
  if (tipo === 'sem_justa_causa') {
    multaFGTS = Number(((saldoFGTS + fgtsRescisao) * 0.40).toFixed(2));
  } else if (tipo === 'acordo_mutuo') {
    multaFGTS = Number(((saldoFGTS + fgtsRescisao) * 0.20).toFixed(2));
  }

  // 6. Totais e Descontos
  const totalProventos = Number((saldoSalario + avisoIndenizado + feriasVencidasVal + feriasProporcionaisVal + tercoFerias + decimoTerceiro).toFixed(2));
  
  // INSS incide sobre Saldo Salário e 13º
  const inss = calcINSS(saldoSalario) + calcINSS(decimoTerceiro);
  
  // IRRF incide sobre verbas salariais (Saldo Salário + 13º) descontado INSS
  const baseIRRF = (saldoSalario + decimoTerceiro) - inss;
  const irrf = calcIRRF(baseIRRF, dependentes);
  
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
