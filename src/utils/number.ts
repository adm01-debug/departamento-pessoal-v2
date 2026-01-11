// V15-150: src/utils/number.ts
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function round(value: number, decimals = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function formatNumber(value: number, locale = 'pt-BR'): string {
  return value.toLocaleString(locale);
}

export function formatCurrency(value: number, currency = 'BRL', locale = 'pt-BR'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

export function formatPercent(value: number, decimals = 0): string {
  return `${round(value * 100, decimals)}%`;
}

export function parseNumber(str: string): number {
  return parseFloat(str.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
}

export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function sum(numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

export function average(numbers: number[]): number {
  return numbers.length ? sum(numbers) / numbers.length : 0;
}

export function percentage(value: number, total: number): number {
  return total === 0 ? 0 : round((value / total) * 100, 2);
}

export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}
