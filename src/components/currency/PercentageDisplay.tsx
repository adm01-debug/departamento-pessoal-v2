interface PercentageDisplayProps { value: number; decimals?: number; className?: string; showSign?: boolean; }
export function PercentageDisplay({ value, decimals = 1, className, showSign = false }: PercentageDisplayProps) {
  const formatted = value.toFixed(decimals);
  const sign = value > 0 && showSign ? '+' : '';
  const color = value < 0 ? 'text-red-600' : value > 0 ? 'text-green-600' : '';
  return <span className={`${color} ${className}`}>{sign}{formatted}%</span>;
}
