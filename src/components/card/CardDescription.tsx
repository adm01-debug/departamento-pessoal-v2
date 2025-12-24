/**
 * @file CardDescription.tsx
 * @description Descrição/subtítulo do card
 * @category Components/Card
 */

import React, { memo } from 'react';
import { CardDescription as ShadcnCardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Props do CardDescription
 */
export interface CardDescriptionProps {
  /** Texto da descrição */
  children: React.ReactNode;
  /** Classe adicional */
  className?: string;
  /** Tamanho do texto */
  size?: 'sm' | 'md' | 'lg';
  /** Truncar texto */
  truncate?: boolean;
  /** Máximo de linhas */
  maxLines?: number;
  /** Alinhamento */
  align?: 'left' | 'center' | 'right';
}

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/**
 * Descrição/subtítulo do card
 * 
 * @example
 * ```tsx
 * <CardDescription size="md" maxLines={2}>
 *   Uma breve descrição do conteúdo...
 * </CardDescription>
 * ```
 */
export const CardDescription = memo(function CardDescription({
  children,
  className,
  size = 'md',
  truncate = false,
  maxLines,
  align = 'left',
}: CardDescriptionProps) {
  return (
    <ShadcnCardDescription
      className={cn(
        sizeClasses[size],
        alignClasses[align],
        'text-muted-foreground',
        truncate && 'truncate',
        maxLines && `line-clamp-${maxLines}`,
        className
      )}
    >
      {children}
    </ShadcnCardDescription>
  );
});

CardDescription.displayName = 'CardDescription';

export default CardDescription;
