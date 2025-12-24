/**
 * @module Header
 * @description Header do layout principal
 * @category Layout
 */

import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Props do componente Header
 */
interface HeaderProps {
  /** Título ou logo */
  title?: string | React.ReactNode;
  /** Conteúdo à direita */
  rightContent?: React.ReactNode;
  /** Callback ao clicar no menu mobile */
  onMenuClick?: () => void;
  /** Mostrar botão de menu */
  showMenuButton?: boolean;
  /** Header fixo no topo */
  sticky?: boolean;
  /** Altura do header */
  height?: "sm" | "md" | "lg";
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Mapeamento de alturas
 */
const heightClasses: Record<string, string> = {
  sm: "h-12",
  md: "h-14",
  lg: "h-16",
};

/**
 * Header - Cabeçalho do layout
 *
 * @description Header principal com logo, navegação
 * e ações do usuário
 *
 * @example
 * ```tsx
 * <Header title="Sistema RH" />
 * <Header 
 *   title={<Logo />}
 *   rightContent={<UserMenu />}
 *   onMenuClick={() => setSidebarOpen(true)}
 * />
 * ```
 */
export const Header = React.memo(function Header({
  title = "Sistema RH",
  rightContent,
  onMenuClick,
  showMenuButton = true,
  sticky = true,
  height = "md",
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "border-b bg-background z-40",
        heightClasses[height],
        sticky && "sticky top-0",
        className
      )}
    >
      <div className="flex h-full items-center justify-between px-4">
        {/* Lado esquerdo */}
        <div className="flex items-center gap-3">
          {showMenuButton && onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          {typeof title === "string" ? (
            <h1 className="text-lg font-semibold">{title}</h1>
          ) : (
            title
          )}
        </div>

        {/* Lado direito */}
        {rightContent && (
          <div className="flex items-center gap-2">
            {rightContent}
          </div>
        )}
      </div>
    </header>
  );
});

Header.displayName = "Header";

export default Header;
export type { HeaderProps };
