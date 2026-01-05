export interface ProporcionalResult { valorIntegral: number; valorProporcional: number; diasTrabalhados: number; diasMes: number; fator: number; }
export function calculoProporcional(valorMensal: number, diasTrabalhados: number, diasMes: number = 30): ProporcionalResult {
  const fator = diasTrabalhados / diasMes;
  return { valorIntegral: valorMensal, valorProporcional: Math.round(valorMensal * fator * 100) / 100, diasTrabalhados, diasMes, fator };
}
export function calcularAvosFerias(mesesTrabalhados: number): number { return Math.min(mesesTrabalhados, 12); }
export function calcularAvos13(mesesTrabalhados: number): number { return Math.min(mesesTrabalhados, 12); }
export default calculoProporcional;
