/**
 * @file DropdownItem.tsx
 * @description Item clicável do dropdown menu
 * @category Components/Dropdown
 */

import React, { memo } from 'react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

/**
 * Props do DropdownItem
 */
export interface DropdownItemProps {
  /** Conteúdo do item */
  children: React.ReactNode;
  /** Classe adicional */
  className?: string;
  /** Ícone à esquerda */
  icon?: React.ReactNode;
  /** Atalho de teclado */
  shortcut?: string;
  /** Se está desabilitado */
  disabled?: boolean;
  /** Variante destrutiva */
  destructive?: boolean;
  /** Callback de clique */
  onSelect?: () => void;
  /** Se deve fechar ao selecionar */
  closeOnSelect?: boolean;
}

/**
 * Item clicável do dropdown menu
 * 
 * @example
 * ```tsx
 * <DropdownItem 
 *   icon={<Edit />} 
 *   shortcut="⌘E"
 *   onSelect={() => handleEdit()}
 * >
 *   Editar
 * </DropdownItem>
 * ```
 */
export const DropdownItem = memo(function DropdownItem({
  children,
  className,
  icon,
  shortcut,
  disabled = false,
  destructive = false,
  onSelect,
  closeOnSelect = true,
}: DropdownItemProps) {
  const handleSelect = (e: Event) => {
    if (!closeOnSelect) {
      e.preventDefault();
    }
    onSelect?.();
  };

  return (
    <DropdownMenuItem
      disabled={disabled}
      onSelect={handleSelect}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        destructive && 'text-destructive focus:text-destructive focus:bg-destructive/10',
        className
      )}
    >
      {icon && (
        <span className="mr-2 h-4 w-4 shrink-0">
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
      {shortcut && (
        <span className="ml-auto text-xs tracking-widest text-muted-foreground">
          {shortcut}
        </span>
      )}
    </DropdownMenuItem>
  );
});

DropdownItem.displayName = 'DropdownItem';

export default DropdownItem;
