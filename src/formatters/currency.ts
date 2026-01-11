// V15-315
export function formatCurrency(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', ...options }).format(value);
}
export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
}
export function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}
