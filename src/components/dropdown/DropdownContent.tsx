/**
 * @file DropdownContent.tsx
 * @description Conteúdo do dropdown menu
 * @category Components/Dropdown
 */

import React, { memo } from 'react';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

/**
 * Props do DropdownContent
 */
export interface DropdownContentProps {
  /** Itens do menu */
  children: React.ReactNode;
  /** Classe adicional */
  className?: string;
  /** Alinhamento */
  align?: 'start' | 'center' | 'end';
  /** Lado de abertura */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Offset em relação ao trigger */
  sideOffset?: number;
  /** Largura mínima */
  minWidth?: number | string;
  /** Largura máxima */
  maxWidth?: number | string;
  /** Altura máxima */
  maxHeight?: number | string;
}

/**
 * Conteúdo do dropdown menu
 * 
 * @example
 * ```tsx
 * <DropdownContent align="end" sideOffset={5}>
 *   <DropdownItem>Opção 1</DropdownItem>
 *   <DropdownItem>Opção 2</DropdownItem>
 * </DropdownContent>
 * ```
 */
export const DropdownContent = memo(function DropdownContent({
  children,
  className,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  minWidth,
  maxWidth,
  maxHeight,
}: DropdownContentProps) {
  const style: React.CSSProperties = {};
  if (minWidth) style.minWidth = typeof minWidth === 'number' ? `${minWidth}px` : minWidth;
  if (maxWidth) style.maxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
  if (maxHeight) style.maxHeight = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;

  return (
    <DropdownMenuContent
      align={align}
      side={side}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        'animate-in fade-in-0 zoom-in-95',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        maxHeight && 'overflow-y-auto',
        className
      )}
      style={Object.keys(style).length > 0 ? style : undefined}
    >
      {children}
    </DropdownMenuContent>
  );
});

DropdownContent.displayName = 'DropdownContent';

export default DropdownContent;
