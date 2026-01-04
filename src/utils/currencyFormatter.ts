export function formatCurrency(value: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(value);
}
export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^\d,-]/g, "").replace(",", ".")) || 0;
}
export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
}
export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}
export default { formatCurrency, parseCurrency, formatNumber, roundCurrency };
