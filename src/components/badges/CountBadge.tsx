/**
 * @file CountBadge.tsx
 * @description Badge numérico com contador
 * @category Components/Badges
 */

import React, { memo, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Props do CountBadge
 */
export interface CountBadgeProps {
  /** Valor do contador */
  count: number;
  /** Valor máximo antes de mostrar "+" */
  max?: number;
  /** Variante visual */
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  /** Tamanho */
  size?: 'sm' | 'md' | 'lg';
  /** Se deve mostrar zero */
  showZero?: boolean;
  /** Classe adicional */
  className?: string;
  /** Formatação customizada */
  formatValue?: (count: number) => string;
  /** Se deve pulsar quando > 0 */
  pulse?: boolean;
  /** Cor de fundo customizada */
  color?: string;
}

const sizeClasses = {
  sm: 'h-4 min-w-4 text-[10px] px-1',
  md: 'h-5 min-w-5 text-xs px-1.5',
  lg: 'h-6 min-w-6 text-sm px-2',
};

/**
 * Badge numérico com contador
 * 
 * @example
 * ```tsx
 * <CountBadge count={5} max={99} variant="destructive" />
 * <CountBadge count={150} max={99} /> // Exibe "99+"
 * ```
 */
export const CountBadge = memo(function CountBadge({
  count,
  max = 99,
  variant = 'default',
  size = 'md',
  showZero = false,
  className,
  formatValue,
  pulse = false,
  color,
}: CountBadgeProps) {
  const displayValue = useMemo(() => {
    if (formatValue) {
      return formatValue(count);
    }
    if (count > max) {
      return `${max}+`;
    }
    return count.toString();
  }, [count, max, formatValue]);

  // Não renderiza se count é 0 e showZero é false
  if (count === 0 && !showZero) {
    return null;
  }

  return (
    <Badge
      variant={variant}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium',
        sizeClasses[size],
        pulse && count > 0 && 'animate-pulse',
        className
      )}
      style={color ? { backgroundColor: color } : undefined}
    >
      {displayValue}
    </Badge>
  );
});

CountBadge.displayName = 'CountBadge';

export default CountBadge;
