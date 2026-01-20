// V18-C004: Calculadora DSR Expandida - Comissionados
export interface ParamsDSR {
  valorVariaveis: number;
  diasUteis: number;
  domingosFeriados: number;
}

export interface ParamsDSRComissionado {
  comissoes: number[];
  diasUteisMes: number[];
  domingosFeriadosMes: number[];
}

export function calcularDSR(params: ParamsDSR): number {
  const { valorVariaveis, diasUteis, domingosFeriados } = params;
  if (diasUteis <= 0) return 0;
  return Math.round((valorVariaveis / diasUteis) * domingosFeriados * 100) / 100;
}

export function calcularDSRHorasExtras(valorHE: number, diasUteis: number, domingos: number): number {
  return calcularDSR({ valorVariaveis: valorHE, diasUteis, domingosFeriados: domingos });
}

export function calcularDSRComissoes(valorComissoes: number, diasUteis: number, domingos: number): number {
  return calcularDSR({ valorVariaveis: valorComissoes, diasUteis, domingosFeriados: domingos });
}

// V18-C004: DSR para comissionados com média
export function calcularDSRComissionado(params: ParamsDSRComissionado): number {
  const { comissoes, diasUteisMes, domingosFeriadosMes } = params;
  if (comissoes.length === 0) return 0;
  
  let totalDSR = 0;
  for (let i = 0; i < comissoes.length; i++) {
    const dsr = calcularDSR({
      valorVariaveis: comissoes[i],
      diasUteis: diasUteisMes[i] || 22,
      domingosFeriados: domingosFeriadosMes[i] || 8
    });
    totalDSR += dsr;
  }
  
  return Math.round((totalDSR / comissoes.length) * 100) / 100;
}

// Calcula DSR sobre todas variaveis do mes
export interface VariaveisMes {
  horasExtras50: number;
  horasExtras100: number;
  comissoes: number;
  adicionalNoturno: number;
  outros: number;
}

export function calcularDSRTotal(variaveis: VariaveisMes, diasUteis: number, domingos: number): number {
  const totalVariaveis = variaveis.horasExtras50 + variaveis.horasExtras100 + 
    variaveis.comissoes + variaveis.adicionalNoturno + variaveis.outros;
  return calcularDSR({ valorVariaveis: totalVariaveis, diasUteis, domingosFeriados: domingos });
}
