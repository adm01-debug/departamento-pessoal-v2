/**
 * @file ButtonIcon.tsx
 * @description Wrapper para ícones dentro de botões
 * @category Components/Button
 */

import React, { memo } from 'react';
import { cn } from '@/lib/utils';

/**
 * Props do ButtonIcon
 */
export interface ButtonIconProps {
  /** Ícone a ser renderizado */
  children: React.ReactNode;
  /** Posição do ícone */
  position?: 'left' | 'right' | 'only';
  /** Tamanho do ícone */
  size?: 'sm' | 'md' | 'lg';
  /** Se está em loading */
  loading?: boolean;
  /** Classe adicional */
  className?: string;
}

const sizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

const positionClasses = {
  left: 'mr-2',
  right: 'ml-2',
  only: '',
};

/**
 * Wrapper para ícones dentro de botões
 * 
 * @example
 * ```tsx
 * <Button>
 *   <ButtonIcon position="left"><Plus /></ButtonIcon>
 *   Adicionar
 * </Button>
 * ```
 */
export const ButtonIcon = memo(function ButtonIcon({
  children,
  position = 'left',
  size = 'md',
  loading = false,
  className,
}: ButtonIconProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center shrink-0',
        sizeClasses[size],
        positionClasses[position],
        loading && 'animate-spin',
        className
      )}
      aria-hidden="true"
    >
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ className?: string }>, {
            className: cn(
              sizeClasses[size],
              (children as React.ReactElement<{ className?: string }>).props.className
            ),
          })
        : children}
    </span>
  );
});

ButtonIcon.displayName = 'ButtonIcon';

export default ButtonIcon;
