const TABELA_2025 = [{ faixa: 1412.00, aliquota: 7.5 }, { faixa: 2666.68, aliquota: 9 }, { faixa: 4000.03, aliquota: 12 }, { faixa: 7786.02, aliquota: 14 }];
export function calcularINSS(salarioBruto: number): { baseCalculo: number; valorDesconto: number; aliquotaEfetiva: number } {
  let valorDesconto = 0, anteriorFaixa = 0;
  const base = Math.min(salarioBruto, 7786.02);
  for (const t of TABELA_2025) { if (salarioBruto <= anteriorFaixa) break; const baseFaixa = Math.min(base, t.faixa) - anteriorFaixa; if (baseFaixa > 0) valorDesconto += baseFaixa * t.aliquota / 100; anteriorFaixa = t.faixa; }
  return { baseCalculo: base, valorDesconto, aliquotaEfetiva: (valorDesconto / salarioBruto) * 100 };
}
export default calcularINSS;
