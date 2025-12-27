import { formatCurrency } from '@/lib/currencyHelpers';
interface CurrencyDisplayProps { value: number; className?: string; showSign?: boolean; }
export function CurrencyDisplay({ value, className, showSign = false }: CurrencyDisplayProps) {
  const formatted = formatCurrency(Math.abs(value));
  const sign = value < 0 ? '-' : value > 0 && showSign ? '+' : '';
  const color = value < 0 ? 'text-red-600' : value > 0 ? 'text-green-600' : '';
  return <span className={`${color} ${className}`}>{sign}{formatted}</span>;
}
