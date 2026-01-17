// V18: Calculadora de Rescisão Trabalhista - Completa e Documentada
// CLT Art. 477-486 - Rescisão do Contrato de Trabalho

import { calcularINSS } from "./inss";
import { calcularIRRF } from "./irrf";

export type TipoRescisao = 
  | "sem_justa_causa" 
  | "justa_causa" 
  | "pedido_demissao" 
  | "acordo" 
  | "termino_contrato";

export interface DadosRescisao {
  salarioBase: number;
  dataAdmissao: Date;
  dataRescisao: Date;
  tipoRescisao: TipoRescisao;
  saldoFGTS: number;
  diasTrabalhados?: number;
  feriasVencidas?: boolean;
  avisoPrevioTrabalhado?: boolean;
  mediaVariaveis?: number;
  dependentesIRRF?: number;
}

export interface ResultadoRescisao {
  // Proventos
  saldoSalario: number;
  decimoTerceiro: number;
  feriasProporcionais: number;
  tercoFeriasProporcionais: number;
  feriasVencidas: number;
  tercoFeriasVencidas: number;
  avisoPrevioIndenizado: number;
  diasAvisoPrevio: number;
  
  // FGTS
  multaFGTS: number;
  percentualMulta: number;
  
  // Totais
  totalProventos: number;
  
  // Descontos
  inss: number;
  irrf: number;
  totalDescontos: number;
  
  // Líquido
  totalLiquido: number;
  
  // Direitos
  sacaFGTS: boolean;
  seguroDesemprego: boolean;
}

/**
 * Calcula rescisão trabalhista completa
 */
export function calcularRescisao(dados: DadosRescisao): ResultadoRescisao {
  const { 
    salarioBase, 
    dataAdmissao, 
    dataRescisao, 
    tipoRescisao, 
    saldoFGTS,
    diasTrabalhados,
    feriasVencidas = false,
    avisoPrevioTrabalhado = false,
    mediaVariaveis = 0,
    dependentesIRRF = 0
  } = dados;
  
  const salarioTotal = salarioBase + mediaVariaveis;
  
  // Calcular tempo de serviço
  const admissao = new Date(dataAdmissao);
  const rescisao = new Date(dataRescisao);
  const diasServico = Math.floor((rescisao.getTime() - admissao.getTime()) / (1000 * 60 * 60 * 24));
  const anosServico = Math.floor(diasServico / 365);
  const mesesServico = Math.floor((diasServico % 365) / 30);
  
  // Dias trabalhados no mês
  const diasNoMes = diasTrabalhados ?? rescisao.getDate();
  
  // 1. Saldo de salário
  const saldoSalario = Math.round((salarioTotal / 30) * diasNoMes * 100) / 100;
  
  // 2. 13º proporcional (exceto justa causa)
  let decimoTerceiro = 0;
  if (tipoRescisao !== "justa_causa") {
    const meses13 = rescisao.getMonth() + (rescisao.getDate() >= 15 ? 1 : 0);
    decimoTerceiro = Math.round((salarioTotal / 12) * meses13 * 100) / 100;
  }
  
  // 3. Férias proporcionais (exceto justa causa)
  let feriasProporcionais = 0;
  let tercoFeriasProporcionais = 0;
  if (tipoRescisao !== "justa_causa") {
    const avosFerias = mesesServico + (diasServico % 30 >= 15 ? 1 : 0);
    feriasProporcionais = Math.round((salarioTotal / 12) * Math.min(avosFerias, 12) * 100) / 100;
    tercoFeriasProporcionais = Math.round(feriasProporcionais / 3 * 100) / 100;
  }
  
  // 4. Férias vencidas (sempre paga)
  let feriasVencidasValor = 0;
  let tercoFeriasVencidas = 0;
  if (feriasVencidas) {
    feriasVencidasValor = salarioTotal;
    tercoFeriasVencidas = Math.round(salarioTotal / 3 * 100) / 100;
  }
  
  // 5. Aviso prévio
  let avisoPrevioIndenizado = 0;
  let diasAvisoPrevio = 0;
  if ((tipoRescisao === "sem_justa_causa" || tipoRescisao === "acordo") && !avisoPrevioTrabalhado) {
    diasAvisoPrevio = 30 + Math.min(anosServico * 3, 60); // Máx 90 dias
    if (tipoRescisao === "acordo") {
      diasAvisoPrevio = Math.floor(diasAvisoPrevio / 2); // 50% no acordo
    }
    avisoPrevioIndenizado = Math.round((salarioTotal / 30) * diasAvisoPrevio * 100) / 100;
  }
  
  // 6. Multa FGTS
  let multaFGTS = 0;
  let percentualMulta = 0;
  if (tipoRescisao === "sem_justa_causa") {
    percentualMulta = 40;
    multaFGTS = Math.round(saldoFGTS * 0.40 * 100) / 100;
  } else if (tipoRescisao === "acordo") {
    percentualMulta = 20;
    multaFGTS = Math.round(saldoFGTS * 0.20 * 100) / 100;
  }
  
  // Total proventos
  const totalProventos = saldoSalario + decimoTerceiro + 
    feriasProporcionais + tercoFeriasProporcionais +
    feriasVencidasValor + tercoFeriasVencidas +
    avisoPrevioIndenizado;
  
  // Descontos
  // INSS incide sobre: saldo salário + aviso prévio + 13º
  const baseINSS = saldoSalario + avisoPrevioIndenizado + decimoTerceiro;
  const inss = calcularINSS(baseINSS);
  
  // IRRF incide sobre: total - férias
  const baseIRRF = totalProventos - feriasProporcionais - tercoFeriasProporcionais - 
    feriasVencidasValor - tercoFeriasVencidas - inss;
  const irrf = calcularIRRF(baseIRRF, dependentesIRRF);
  
  const totalDescontos = inss + irrf;
  
  // Direitos
  const sacaFGTS = tipoRescisao === "sem_justa_causa" || tipoRescisao === "acordo";
  const seguroDesemprego = tipoRescisao === "sem_justa_causa";
  
  return {
    saldoSalario,
    decimoTerceiro,
    feriasProporcionais,
    tercoFeriasProporcionais,
    feriasVencidas: feriasVencidasValor,
    tercoFeriasVencidas,
    avisoPrevioIndenizado,
    diasAvisoPrevio,
    multaFGTS,
    percentualMulta,
    totalProventos: Math.round(totalProventos * 100) / 100,
    inss,
    irrf,
    totalDescontos: Math.round(totalDescontos * 100) / 100,
    totalLiquido: Math.round((totalProventos + multaFGTS - totalDescontos) * 100) / 100,
    sacaFGTS,
    seguroDesemprego
  };
}

export default calcularRescisao;
