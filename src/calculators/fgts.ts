// V18: Calculadora FGTS - Atualizada e Documentada
// Lei 8.036/1990 - FGTS

import { PERCENTUAL_FGTS, PERCENTUAL_MULTA_FGTS, PERCENTUAL_MULTA_FGTS_ACORDO } from "@/constants/tabelas.constants";

export type TipoRescisaoFGTS = 
  | "sem_justa_causa" 
  | "justa_causa" 
  | "pedido_demissao" 
  | "acordo"
  | "aposentadoria"
  | "falecimento";

export interface ResultadoFGTS {
  deposito: number;
  percentual: number;
}

export interface ResultadoFGTSRescisorio {
  saldoFGTS: number;
  multa: number;
  percentualMulta: number;
  totalSaque: number;
  percentualSaque: number;
  podeSacar: boolean;
}

/**
 * Calcula depósito mensal do FGTS (8%)
 * @param baseCalculo - Base de cálculo (salário + adicionais)
 */
export function calcularFGTS(baseCalculo: number): ResultadoFGTS {
  if (baseCalculo <= 0) {
    return { deposito: 0, percentual: PERCENTUAL_FGTS };
  }
  
  const deposito = Math.round(baseCalculo * (PERCENTUAL_FGTS / 100) * 100) / 100;
  
  return {
    deposito,
    percentual: PERCENTUAL_FGTS
  };
}

/**
 * Calcula FGTS rescisório com multa
 * @param saldoFGTS - Saldo atual do FGTS
 * @param tipoRescisao - Tipo de rescisão
 */
export function calcularFGTSRescisorio(
  saldoFGTS: number, 
  tipoRescisao: TipoRescisaoFGTS
): ResultadoFGTSRescisorio {
  let multa = 0;
  let percentualMulta = 0;
  let totalSaque = 0;
  let percentualSaque = 0;
  let podeSacar = false;
  
  switch (tipoRescisao) {
    case "sem_justa_causa":
      // Multa 40% + saque integral
      percentualMulta = PERCENTUAL_MULTA_FGTS;
      multa = Math.round(saldoFGTS * (percentualMulta / 100) * 100) / 100;
      totalSaque = saldoFGTS + multa;
      percentualSaque = 100;
      podeSacar = true;
      break;
      
    case "acordo":
      // Multa 20% + saque 80%
      percentualMulta = PERCENTUAL_MULTA_FGTS_ACORDO;
      multa = Math.round(saldoFGTS * (percentualMulta / 100) * 100) / 100;
      percentualSaque = 80;
      totalSaque = Math.round((saldoFGTS * 0.80 + multa) * 100) / 100;
      podeSacar = true;
      break;
      
    case "aposentadoria":
    case "falecimento":
      // Saque integral, sem multa
      totalSaque = saldoFGTS;
      percentualSaque = 100;
      podeSacar = true;
      break;
      
    case "justa_causa":
    case "pedido_demissao":
    default:
      // Não saca, não tem multa
      podeSacar = false;
      break;
  }
  
  return {
    saldoFGTS,
    multa,
    percentualMulta,
    totalSaque,
    percentualSaque,
    podeSacar
  };
}

/**
 * Calcula projeção de saldo FGTS
 * @param salario - Salário mensal
 * @param meses - Quantidade de meses
 */
export function calcularProjecaoFGTS(salario: number, meses: number): number {
  const { deposito } = calcularFGTS(salario);
  return Math.round(deposito * meses * 100) / 100;
}

/**
 * Calcula correção monetária do FGTS (TR + 3% a.a.)
 * @param saldo - Saldo atual
 * @param meses - Período em meses
 * @param taxaTR - Taxa TR mensal (default 0)
 */
export function calcularCorrecaoFGTS(
  saldo: number, 
  meses: number, 
  taxaTR: number = 0
): number {
  const taxaMensal = (3 / 12 / 100) + (taxaTR / 100); // 3% a.a. + TR
  const saldoCorrigido = saldo * Math.pow(1 + taxaMensal, meses);
  return Math.round(saldoCorrigido * 100) / 100;
}

export default calcularFGTS;
