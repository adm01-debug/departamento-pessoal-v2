/**
 * @fileoverview Componente Skeleton para estados de carregamento
 * @module components/ui/skeleton
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

/** Props do Skeleton */
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Variante do skeleton */
  variant?: 'default' | 'circular' | 'text';
  /** Animação */
  animation?: 'pulse' | 'shimmer' | 'none';
}

/**
 * Placeholder animado para conteúdo em carregamento
 * @param props - Propriedades do componente
 * @returns Elemento JSX do skeleton
 */
function Skeleton({
  className,
  variant = 'default',
  animation = 'pulse',
  ...props
}: SkeletonProps) {
  const variantStyles = {
    default: 'rounded-md',
    circular: 'rounded-full',
    text: 'rounded h-4 w-full',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    shimmer: 'animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%]',
    none: '',
  };

  return (
    <div
      className={cn(
        'bg-muted',
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
