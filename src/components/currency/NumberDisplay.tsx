interface NumberDisplayProps { value: number; className?: string; locale?: string; }
export function NumberDisplay({ value, className, locale = 'pt-BR' }: NumberDisplayProps) {
  return <span className={className}>{value.toLocaleString(locale)}</span>;
}
