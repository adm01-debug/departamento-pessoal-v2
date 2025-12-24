/**
 * @file DropdownSeparator.tsx
 * @description Separador visual entre itens do dropdown
 * @category Components/Dropdown
 */

import React, { memo } from 'react';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

/**
 * Props do DropdownSeparator
 */
export interface DropdownSeparatorProps {
  /** Classe adicional */
  className?: string;
  /** Espessura da linha */
  thickness?: 'thin' | 'normal' | 'thick';
  /** Margem vertical */
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

const thicknessClasses = {
  thin: 'h-px',
  normal: 'h-[1px]',
  thick: 'h-0.5',
};

const spacingClasses = {
  none: 'my-0',
  sm: 'my-1',
  md: 'my-2',
  lg: 'my-3',
};

/**
 * Separador visual entre itens do dropdown
 * 
 * @example
 * ```tsx
 * <DropdownContent>
 *   <DropdownItem>Editar</DropdownItem>
 *   <DropdownSeparator />
 *   <DropdownItem destructive>Excluir</DropdownItem>
 * </DropdownContent>
 * ```
 */
export const DropdownSeparator = memo(function DropdownSeparator({
  className,
  thickness = 'normal',
  spacing = 'sm',
}: DropdownSeparatorProps) {
  return (
    <DropdownMenuSeparator
      className={cn(
        '-mx-1 bg-muted',
        thicknessClasses[thickness],
        spacingClasses[spacing],
        className
      )}
    />
  );
});

DropdownSeparator.displayName = 'DropdownSeparator';

export default DropdownSeparator;
