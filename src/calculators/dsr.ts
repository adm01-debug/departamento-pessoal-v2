// V17-C017: Calculadora de DSR (Descanso Semanal Remunerado)
export interface ParamsDSR {
  valorVariaveis: number;
  diasUteis: number;
  domingosFeriados: number;
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
