export interface SalarioFamiliaResult { temDireito: boolean; valorPorDependente: number; totalDependentes: number; valorTotal: number; }
export function calculoSalarioFamilia(salarioBruto: number, numeroDependentes: number, ano: number = 2025): SalarioFamiliaResult {
  const limite = ano >= 2025 ? 1912.45 : 1819.26;
  const valorCota = ano >= 2025 ? 65.14 : 62.04;
  if (salarioBruto > limite) return { temDireito: false, valorPorDependente: 0, totalDependentes: numeroDependentes, valorTotal: 0 };
  return { temDireito: true, valorPorDependente: valorCota, totalDependentes: numeroDependentes, valorTotal: valorCota * numeroDependentes };
}
export default calculoSalarioFamilia;
