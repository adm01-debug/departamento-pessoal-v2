// V15-129: src/lib/currency.ts
export function formatCurrency(value: number, locale = 'pt-BR', currency = 'BRL'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[R$\s.]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

export function formatNumber(value: number, decimals = 2): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatPercent(value: number, decimals = 2): string {
  return (value * 100).toFixed(decimals) + '%';
}

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function sumValues(values: number[]): number {
  return roundCurrency(values.reduce((acc, val) => acc + val, 0));
}

export function calcPercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return roundCurrency((value / total) * 100);
}

export function applyDiscount(value: number, discount: number, isPercent = true): number {
  if (isPercent) return roundCurrency(value * (1 - discount / 100));
  return roundCurrency(value - discount);
}

export function calcINSS(salario: number): number {
  const faixas = [
    { limite: 1412.00, aliquota: 0.075 },
    { limite: 2666.68, aliquota: 0.09 },
    { limite: 4000.03, aliquota: 0.12 },
    { limite: 7786.02, aliquota: 0.14 },
  ];
  let inss = 0, anterior = 0;
  for (const faixa of faixas) {
    if (salario > anterior) {
      const base = Math.min(salario, faixa.limite) - anterior;
      inss += base * faixa.aliquota;
      anterior = faixa.limite;
    }
  }
  return roundCurrency(inss);
}

export function calcIRRF(salario: number, inss: number, dependentes = 0): number {
  const base = salario - inss - (dependentes * 189.59);
  const faixas = [
    { limite: 2259.20, aliquota: 0, deducao: 0 },
    { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
    { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
    { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
    { limite: Infinity, aliquota: 0.275, deducao: 896.00 },
  ];
  for (const faixa of faixas) {
    if (base <= faixa.limite) return roundCurrency(Math.max(0, base * faixa.aliquota - faixa.deducao));
  }
  return 0;
}
