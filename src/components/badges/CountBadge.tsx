/**
 * @fileoverview Badge de contagem
 * @module components/badges/CountBadge
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';

/** Props do CountBadge */
interface CountBadgeProps {
  /** Valor numérico a exibir */
  count: number;
  /** Valor máximo antes de exibir "+" */
  max?: number;
  /** Variante de cor */
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'success';
  /** Tamanho do badge */
  size?: 'sm' | 'md' | 'lg';
  /** Classes CSS adicionais */
  className?: string;
  /** Se deve mostrar zero */
  showZero?: boolean;
}

/** Mapeamento de variantes para estilos */
const variantStyles: Record<string, string> = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
  success: 'bg-green-500 text-white',
};

/** Mapeamento de tamanhos */
const sizeStyles: Record<string, string> = {
  sm: 'h-4 min-w-4 text-[10px] px-1',
  md: 'h-5 min-w-5 text-xs px-1.5',
  lg: 'h-6 min-w-6 text-sm px-2',
};

/**
 * Badge que exibe um contador numérico
 * @param props - Propriedades do componente
 * @returns Elemento JSX do badge ou null
 */
export const CountBadge = memo(function CountBadge({
  count,
  max = 99,
  variant = 'default',
  size = 'md',
  className,
  showZero = false,
}: CountBadgeProps) {
  if (count === 0 && !showZero) return null;

  const displayValue = count > max ? `${max}+` : count.toString();

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {displayValue}
    </span>
  );
});
