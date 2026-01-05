export interface SalarioFamiliaInput { salarioBruto: number; numeroDependentes: number; competencia?: string; }
export interface SalarioFamiliaResult { temDireito: boolean; valorCota: number; totalBeneficio: number; faixa: string; }
const TABELAS: Record<string, { limite: number; valor: number }[]> = {
  "2024": [{ limite: 1819.26, valor: 62.04 }],
  "2025": [{ limite: 1911.00, valor: 65.14 }],
  "2026": [{ limite: 2006.55, valor: 68.40 }],
};
export function calcularSalarioFamilia(input: SalarioFamiliaInput): SalarioFamiliaResult {
  const { salarioBruto, numeroDependentes, competencia } = input;
  const ano = competencia ? competencia.substring(0, 4) : new Date().getFullYear().toString();
  const tabela = TABELAS[ano] || TABELAS["2026"];
  const faixa = tabela.find(f => salarioBruto <= f.limite);
  if (!faixa || numeroDependentes <= 0) {
    return { temDireito: false, valorCota: 0, totalBeneficio: 0, faixa: `Salário acima do limite (R$ ${tabela[0].limite})` };
  }
  const totalBeneficio = Number((faixa.valor * numeroDependentes).toFixed(2));
  return { temDireito: true, valorCota: faixa.valor, totalBeneficio, faixa: `Até R$ ${faixa.limite}` };
}
export function calcularSalarioFamiliaProporcional(input: SalarioFamiliaInput, diasTrabalhados: number, diasMes: number = 30): SalarioFamiliaResult {
  const resultado = calcularSalarioFamilia(input);
  if (!resultado.temDireito) return resultado;
  const proporcional = Number(((resultado.totalBeneficio / diasMes) * diasTrabalhados).toFixed(2));
  return { ...resultado, totalBeneficio: proporcional };
}
export default { calcularSalarioFamilia, calcularSalarioFamiliaProporcional };
