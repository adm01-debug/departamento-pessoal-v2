export interface TabelaINSS { ano: number; faixas: { de: number; ate: number; aliquota: number }[]; teto: number; }
const TABELAS_INSS: Record<number, TabelaINSS> = {
  2024: { ano: 2024, faixas: [{ de: 0, ate: 1412.00, aliquota: 7.5 }, { de: 1412.01, ate: 2666.68, aliquota: 9 }, { de: 2666.69, ate: 4000.03, aliquota: 12 }, { de: 4000.04, ate: 7786.02, aliquota: 14 }], teto: 7786.02 },
  2025: { ano: 2025, faixas: [{ de: 0, ate: 1518.00, aliquota: 7.5 }, { de: 1518.01, ate: 2793.88, aliquota: 9 }, { de: 2793.89, ate: 4190.83, aliquota: 12 }, { de: 4190.84, ate: 8157.40, aliquota: 14 }], teto: 8157.40 },
  2026: { ano: 2026, faixas: [{ de: 0, ate: 1594.00, aliquota: 7.5 }, { de: 1594.01, ate: 2933.57, aliquota: 9 }, { de: 2933.58, ate: 4400.37, aliquota: 12 }, { de: 4400.38, ate: 8565.27, aliquota: 14 }], teto: 8565.27 },
};
export interface INSSResult { baseCalculo: number; aliquotaEfetiva: number; valorDesconto: number; detalhamento: { faixa: string; base: number; aliquota: number; valor: number }[]; }
export function calcularINSS(salarioBruto: number, ano: number = new Date().getFullYear()): INSSResult {
  const tabela = TABELAS_INSS[ano] || TABELAS_INSS[2026];
  const baseCalculo = Math.min(salarioBruto, tabela.teto);
  let valorDesconto = 0;
  const detalhamento: INSSResult["detalhamento"] = [];
  let restante = baseCalculo;
  for (const faixa of tabela.faixas) {
    if (restante <= 0) break;
    const baseFaixa = Math.min(restante, faixa.ate - faixa.de + (faixa.de === 0 ? 0 : 0.01));
    const valorFaixa = Number((baseFaixa * (faixa.aliquota / 100)).toFixed(2));
    valorDesconto += valorFaixa;
    detalhamento.push({ faixa: `R$ ${faixa.de.toFixed(2)} a R$ ${faixa.ate.toFixed(2)}`, base: Number(baseFaixa.toFixed(2)), aliquota: faixa.aliquota, valor: valorFaixa });
    restante -= baseFaixa;
  }
  const aliquotaEfetiva = baseCalculo > 0 ? Number(((valorDesconto / baseCalculo) * 100).toFixed(2)) : 0;
  return { baseCalculo, aliquotaEfetiva, valorDesconto: Number(valorDesconto.toFixed(2)), detalhamento };
}
export function getTeto(ano: number = new Date().getFullYear()): number { return (TABELAS_INSS[ano] || TABELAS_INSS[2026]).teto; }
export default { calcularINSS, getTeto, TABELAS_INSS };
