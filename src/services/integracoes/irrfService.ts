const TABELA_2025 = [{ faixa: 2259.20, aliq: 0, ded: 0 }, { faixa: 2826.65, aliq: 7.5, ded: 169.44 }, { faixa: 3751.05, aliq: 15, ded: 381.44 }, { faixa: 4664.68, aliq: 22.5, ded: 662.77 }, { faixa: Infinity, aliq: 27.5, ded: 896 }];
export function calcularIRRF(salarioBruto: number, inss: number, dependentes: number = 0): { baseCalculo: number; valorIRRF: number; isento: boolean } {
  const base = salarioBruto - inss - (189.59 * dependentes);
  if (base <= 2259.20) return { baseCalculo: base, valorIRRF: 0, isento: true };
  const f = TABELA_2025.find(t => base <= t.faixa)!;
  return { baseCalculo: base, valorIRRF: Math.max(0, base * f.aliq / 100 - f.ded), isento: false };
}
export default calcularIRRF;
