/**
 * @file DropdownMenu.tsx
 * @description Container raiz do dropdown menu
 * @category Components/Dropdown
 */

import React, { memo, useState } from 'react';
import { DropdownMenu as ShadcnDropdownMenu } from '@/components/ui/dropdown-menu';

/**
 * Props do DropdownMenu
 */
export interface DropdownMenuProps {
  /** Trigger e conteúdo do menu */
  children: React.ReactNode;
  /** Estado controlado de abertura */
  open?: boolean;
  /** Callback de mudança de estado */
  onOpenChange?: (open: boolean) => void;
  /** Valor padrão de abertura */
  defaultOpen?: boolean;
  /** Se é modal (bloqueia interação externa) */
  modal?: boolean;
  /** Direção de leitura */
  dir?: 'ltr' | 'rtl';
}

/**
 * Container raiz do dropdown menu
 * 
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownTrigger>
 *     <Button>Opções</Button>
 *   </DropdownTrigger>
 *   <DropdownContent>
 *     <DropdownItem>Editar</DropdownItem>
 *     <DropdownItem>Excluir</DropdownItem>
 *   </DropdownContent>
 * </DropdownMenu>
 * ```
 */
export const DropdownMenu = memo(function DropdownMenu({
  children,
  open,
  onOpenChange,
  defaultOpen = false,
  modal = true,
  dir,
}: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <ShadcnDropdownMenu
      open={isOpen}
      onOpenChange={handleOpenChange}
      modal={modal}
      dir={dir}
    >
      {children}
    </ShadcnDropdownMenu>
  );
});

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;
