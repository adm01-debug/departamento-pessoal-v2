/**
 * @module NavMenu
 * @description Menu de navegação com dropdown
 * @category Navigation
 */

import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * Item do menu
 */
interface NavMenuItem {
  /** ID único */
  id: string;
  /** Label do item */
  label: string;
  /** Ícone do item */
  icon?: React.ReactNode;
  /** Link href */
  href?: string;
  /** Callback ao clicar */
  onClick?: () => void;
  /** Item desabilitado */
  disabled?: boolean;
  /** Separador após este item */
  separator?: boolean;
}

/**
 * Props do componente NavMenu
 */
interface NavMenuProps {
  /** Label do botão trigger */
  label: string;
  /** Ícone do trigger */
  icon?: React.ReactNode;
  /** Itens do menu */
  items: NavMenuItem[];
  /** Alinhamento do dropdown */
  align?: "start" | "center" | "end";
  /** Variante do botão */
  variant?: "default" | "outline" | "ghost" | "secondary";
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * NavMenu - Menu dropdown de navegação
 *
 * @description Menu dropdown com itens clicáveis,
 * ícones e separadores para navegação complexa
 *
 * @example
 * ```tsx
 * <NavMenu
 *   label="Configurações"
 *   icon={<Settings className="h-4 w-4" />}
 *   items={[
 *     { id: "1", label: "Perfil", onClick: () => {} },
 *     { id: "2", label: "Preferências", onClick: () => {} },
 *     { id: "3", label: "Sair", onClick: logout, separator: true },
 *   ]}
 * />
 * ```
 */
export const NavMenu = React.memo(function NavMenu({
  label,
  icon,
  items,
  align = "end",
  variant = "ghost",
  className,
}: NavMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className={cn("gap-2", className)}>
          {icon}
          {label}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {items.map((item) => (
          <React.Fragment key={item.id}>
            <DropdownMenuItem
              disabled={item.disabled}
              onClick={item.onClick}
              asChild={!!item.href}
            >
              {item.href ? (
                <a href={item.href} className="flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </a>
              ) : (
                <span className="flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </span>
              )}
            </DropdownMenuItem>
            {item.separator && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

NavMenu.displayName = "NavMenu";

export default NavMenu;
export type { NavMenuProps, NavMenuItem };
