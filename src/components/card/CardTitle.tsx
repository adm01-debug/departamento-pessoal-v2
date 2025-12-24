/**
 * @file CardTitle.tsx
 * @description Título do card
 * @category Components/Card
 */

import React, { memo } from 'react';
import { CardTitle as ShadcnCardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Props do CardTitle
 */
export interface CardTitleProps {
  /** Texto do título */
  children: React.ReactNode;
  /** Classe adicional */
  className?: string;
  /** Tamanho do título */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Peso da fonte */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  /** Truncar texto longo */
  truncate?: boolean;
  /** Elemento HTML */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
}

const sizeClasses = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
};

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

/**
 * Título do card
 * 
 * @example
 * ```tsx
 * <CardTitle size="lg" weight="bold">
 *   Dashboard
 * </CardTitle>
 * ```
 */
export const CardTitle = memo(function CardTitle({
  children,
  className,
  size = 'md',
  weight = 'semibold',
  truncate = false,
  as: Component = 'h3',
}: CardTitleProps) {
  return (
    <ShadcnCardTitle asChild>
      <Component
        className={cn(
          sizeClasses[size],
          weightClasses[weight],
          'leading-none tracking-tight',
          truncate && 'truncate',
          className
        )}
      >
        {children}
      </Component>
    </ShadcnCardTitle>
  );
});

CardTitle.displayName = 'CardTitle';

export default CardTitle;
