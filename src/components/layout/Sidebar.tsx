/**
 * @module Sidebar
 * @description Sidebar de navegação
 * @category Layout
 */

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Props do componente Sidebar
 */
interface SidebarProps {
  /** Conteúdo da sidebar */
  children: React.ReactNode;
  /** Header/logo */
  header?: React.ReactNode;
  /** Footer da sidebar */
  footer?: React.ReactNode;
  /** Sidebar aberta (mobile) */
  open?: boolean;
  /** Callback ao fechar */
  onClose?: () => void;
  /** Largura da sidebar */
  width?: "sm" | "md" | "lg";
  /** Sidebar colapsada */
  collapsed?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Mapeamento de larguras
 */
const widthClasses: Record<string, string> = {
  sm: "w-56",
  md: "w-64",
  lg: "w-72",
};

/**
 * Sidebar - Navegação lateral
 *
 * @description Sidebar responsiva com suporte a
 * modo mobile (overlay) e desktop (fixed)
 *
 * @example
 * ```tsx
 * <Sidebar
 *   header={<Logo />}
 *   footer={<UserProfile />}
 *   open={isMobileOpen}
 *   onClose={() => setMobileOpen(false)}
 * >
 *   <NavGroup title="Menu">
 *     <NavItem href="/dashboard">Dashboard</NavItem>
 *   </NavGroup>
 * </Sidebar>
 * ```
 */
export const Sidebar = React.memo(function Sidebar({
  children,
  header,
  footer,
  open = true,
  onClose,
  width = "md",
  collapsed = false,
  className,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r",
          "transition-transform duration-300 ease-in-out",
          "lg:relative lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-16" : widthClasses[width],
          className
        )}
      >
        {/* Header */}
        {header && (
          <div className="flex items-center justify-between h-14 px-4 border-b">
            {!collapsed && header}
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="lg:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className={cn("space-y-2", collapsed ? "px-2" : "px-3")}>
            {children}
          </nav>
        </ScrollArea>

        {/* Footer */}
        {footer && !collapsed && (
          <div className="mt-auto border-t p-4">
            {footer}
          </div>
        )}
      </aside>
    </>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
export type { SidebarProps };
