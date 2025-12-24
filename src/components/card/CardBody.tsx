/**
 * @file CardBody.tsx
 * @description Corpo/conteúdo principal do card
 * @category Components/Card
 */

import React, { memo } from 'react';
import { CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Props do CardBody
 */
export interface CardBodyProps {
  /** Conteúdo do card */
  children: React.ReactNode;
  /** Classe adicional */
  className?: string;
  /** Padding interno */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Se o conteúdo deve ter scroll */
  scrollable?: boolean;
  /** Altura máxima (quando scrollable) */
  maxHeight?: string | number;
}

const paddingClasses = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-8',
};

/**
 * Corpo/conteúdo principal do card
 * 
 * @example
 * ```tsx
 * <CardBody padding="md">
 *   <p>Conteúdo do card...</p>
 * </CardBody>
 * ```
 */
export const CardBody = memo(function CardBody({
  children,
  className,
  padding = 'md',
  scrollable = false,
  maxHeight,
}: CardBodyProps) {
  const heightStyle = maxHeight
    ? { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }
    : undefined;

  return (
    <CardContent
      className={cn(
        paddingClasses[padding],
        scrollable && 'overflow-y-auto',
        className
      )}
      style={heightStyle}
    >
      {children}
    </CardContent>
  );
});

CardBody.displayName = 'CardBody';

export default CardBody;
