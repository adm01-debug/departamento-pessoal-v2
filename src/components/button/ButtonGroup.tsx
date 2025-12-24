/**
 * @file ButtonGroup.tsx
 * @description Grupo de botões com espaçamento e layout
 * @category Components/Button
 */

import React, { memo } from 'react';
import { cn } from '@/lib/utils';

/**
 * Props do ButtonGroup
 */
export interface ButtonGroupProps {
  /** Botões filhos */
  children: React.ReactNode;
  /** Orientação do grupo */
  orientation?: 'horizontal' | 'vertical';
  /** Espaçamento entre botões */
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  /** Alinhamento */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Se os botões devem ser unidos (attached) */
  attached?: boolean;
  /** Se deve ocupar largura total */
  fullWidth?: boolean;
  /** Classe adicional */
  className?: string;
}

const spacingClasses = {
  none: 'gap-0',
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-4',
};

const alignClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  stretch: 'justify-stretch',
};

/**
 * Grupo de botões com espaçamento e layout
 * 
 * @example
 * ```tsx
 * <ButtonGroup spacing="md" align="end">
 *   <Button variant="outline">Cancelar</Button>
 *   <Button>Salvar</Button>
 * </ButtonGroup>
 * ```
 */
export const ButtonGroup = memo(function ButtonGroup({
  children,
  orientation = 'horizontal',
  spacing = 'md',
  align = 'start',
  attached = false,
  fullWidth = false,
  className,
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      className={cn(
        'inline-flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        !attached && spacingClasses[spacing],
        alignClasses[align],
        fullWidth && 'w-full',
        attached && [
          '[&>*]:rounded-none',
          orientation === 'horizontal' && [
            '[&>*:first-child]:rounded-l-md',
            '[&>*:last-child]:rounded-r-md',
            '[&>*:not(:first-child)]:-ml-px',
          ],
          orientation === 'vertical' && [
            '[&>*:first-child]:rounded-t-md',
            '[&>*:last-child]:rounded-b-md',
            '[&>*:not(:first-child)]:-mt-px',
          ],
        ],
        className
      )}
    >
      {children}
    </div>
  );
});

ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
