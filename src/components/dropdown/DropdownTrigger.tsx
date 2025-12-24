/**
 * @file DropdownTrigger.tsx
 * @description Elemento que dispara a abertura do dropdown
 * @category Components/Dropdown
 */

import React, { memo } from 'react';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

/**
 * Props do DropdownTrigger
 */
export interface DropdownTriggerProps {
  /** Elemento trigger (normalmente um botão) */
  children: React.ReactNode;
  /** Classe adicional */
  className?: string;
  /** Se deve usar asChild */
  asChild?: boolean;
  /** Se está desabilitado */
  disabled?: boolean;
}

/**
 * Elemento que dispara a abertura do dropdown
 * 
 * @example
 * ```tsx
 * <DropdownTrigger asChild>
 *   <Button variant="outline">
 *     Opções
 *     <ChevronDown className="ml-2 h-4 w-4" />
 *   </Button>
 * </DropdownTrigger>
 * ```
 */
export const DropdownTrigger = memo(function DropdownTrigger({
  children,
  className,
  asChild = true,
  disabled = false,
}: DropdownTriggerProps) {
  return (
    <DropdownMenuTrigger
      asChild={asChild}
      disabled={disabled}
      className={cn(
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
    >
      {children}
    </DropdownMenuTrigger>
  );
});

DropdownTrigger.displayName = 'DropdownTrigger';

export default DropdownTrigger;
