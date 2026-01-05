export interface ProporcionalInput { valorMensal: number; diasTrabalhados: number; diasMes?: number; tipoCalculo?: "DIAS_CORRIDOS" | "DIAS_UTEIS" | "30_DIAS"; }
export interface ProporcionalResult { valorIntegral: number; diasConsiderados: number; diasBase: number; fatorProporcional: number; valorProporcional: number; }
export function calcularProporcional(input: ProporcionalInput): ProporcionalResult {
  const { valorMensal, diasTrabalhados, diasMes, tipoCalculo = "30_DIAS" } = input;
  let diasBase: number;
  switch (tipoCalculo) {
    case "DIAS_CORRIDOS": diasBase = diasMes || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); break;
    case "DIAS_UTEIS": diasBase = diasMes || 22; break;
    default: diasBase = 30;
  }
  const diasConsiderados = Math.min(diasTrabalhados, diasBase);
  const fatorProporcional = diasConsiderados / diasBase;
  const valorProporcional = Number((valorMensal * fatorProporcional).toFixed(2));
  return { valorIntegral: valorMensal, diasConsiderados, diasBase, fatorProporcional: Number(fatorProporcional.toFixed(4)), valorProporcional };
}
export function calcularSalarioProporcional(salarioMensal: number, dataAdmissao: Date, dataReferencia?: Date): ProporcionalResult {
  const ref = dataReferencia || new Date();
  const primeiroDiaMes = new Date(ref.getFullYear(), ref.getMonth(), 1);
  const ultimoDiaMes = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
  let diasTrabalhados: number;
  if (dataAdmissao < primeiroDiaMes) { diasTrabalhados = ultimoDiaMes.getDate(); }
  else if (dataAdmissao > ultimoDiaMes) { diasTrabalhados = 0; }
  else { diasTrabalhados = ultimoDiaMes.getDate() - dataAdmissao.getDate() + 1; }
  return calcularProporcional({ valorMensal: salarioMensal, diasTrabalhados, diasMes: ultimoDiaMes.getDate() });
}
export function calcularAvosProporcional(valorAnual: number, mesesTrabalhados: number): number {
  return Number(((valorAnual / 12) * mesesTrabalhados).toFixed(2));
}
export default { calcularProporcional, calcularSalarioProporcional, calcularAvosProporcional };
