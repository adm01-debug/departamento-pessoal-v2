/**
 * @file ButtonLoading.tsx
 * @description Indicador de loading para botões
 * @category Components/Button
 */

import React, { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props do ButtonLoading
 */
export interface ButtonLoadingProps {
  /** Tamanho do spinner */
  size?: 'sm' | 'md' | 'lg';
  /** Texto de loading */
  text?: string;
  /** Classe adicional */
  className?: string;
  /** Posição do spinner em relação ao texto */
  spinnerPosition?: 'left' | 'right';
  /** Cor do spinner */
  color?: string;
}

const sizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

/**
 * Indicador de loading para botões
 * 
 * @example
 * ```tsx
 * <Button disabled>
 *   <ButtonLoading text="Salvando..." />
 * </Button>
 * ```
 */
export const ButtonLoading = memo(function ButtonLoading({
  size = 'md',
  text,
  className,
  spinnerPosition = 'left',
  color,
}: ButtonLoadingProps) {
  const spinner = (
    <Loader2
      className={cn(
        sizeClasses[size],
        'animate-spin',
        text && (spinnerPosition === 'left' ? 'mr-2' : 'ml-2')
      )}
      style={color ? { color } : undefined}
      aria-hidden="true"
    />
  );

  if (!text) {
    return (
      <span className={cn('inline-flex items-center justify-center', className)}>
        {spinner}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        textSizeClasses[size],
        className
      )}
    >
      {spinnerPosition === 'left' && spinner}
      <span>{text}</span>
      {spinnerPosition === 'right' && spinner}
    </span>
  );
});

ButtonLoading.displayName = 'ButtonLoading';

export default ButtonLoading;
