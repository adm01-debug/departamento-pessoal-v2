/**
 * @module NavItem
 * @description Item de navegação para sidebar
 * @category Layout
 */

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Props do componente NavItem
 */
interface NavItemProps {
  /** Texto do item */
  children: React.ReactNode;
  /** URL de destino */
  href?: string;
  /** Ícone do item */
  icon?: React.ReactNode;
  /** Item ativo */
  active?: boolean;
  /** Desabilitado */
  disabled?: boolean;
  /** Callback ao clicar */
  onClick?: () => void;
  /** Badge de contagem */
  badge?: number | string;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * NavItem - Item de navegação
 *
 * @description Item individual de navegação para uso
 * em sidebars e menus de navegação
 *
 * @example
 * ```tsx
 * <NavItem href="/dashboard" icon={<Home />} active>
 *   Dashboard
 * </NavItem>
 * <NavItem href="/usuarios" icon={<Users />} badge={5}>
 *   Usuários
 * </NavItem>
 * ```
 */
export const NavItem = React.memo(function NavItem({
  children,
  href,
  icon,
  active = false,
  disabled = false,
  onClick,
  badge,
  className,
}: NavItemProps) {
  const Component = href ? "a" : "button";

  return (
    <Component
      href={href}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        "hover:bg-muted/50",
        active && "bg-muted font-medium",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      {icon && (
        <span className={cn(
          "shrink-0",
          active ? "text-foreground" : "text-muted-foreground"
        )}>
          {icon}
        </span>
      )}
      <span className="flex-1 text-left truncate">{children}</span>
      {badge !== undefined && (
        <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Component>
  );
});

NavItem.displayName = "NavItem";

export default NavItem;
export type { NavItemProps };
