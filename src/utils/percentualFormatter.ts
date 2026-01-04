export function formatPercentual(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}
export function parsePercentual(value: string): number {
  return parseFloat(value.replace("%", "").replace(",", ".")) || 0;
}
export function calculatePercentual(partial: number, total: number): number {
  if (total === 0) return 0;
  return (partial / total) * 100;
}
export function applyPercentual(value: number, percentual: number): number {
  return value * (percentual / 100);
}
export default { formatPercentual, parsePercentual, calculatePercentual, applyPercentual };
