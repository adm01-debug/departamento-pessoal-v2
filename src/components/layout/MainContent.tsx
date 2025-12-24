/**
 * @module MainContent
 * @description Área de conteúdo principal
 * @category Layout
 */

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Props do componente MainContent
 */
interface MainContentProps {
  /** Conteúdo da área principal */
  children: React.ReactNode;
  /** Padding interno */
  padding?: "none" | "sm" | "md" | "lg";
  /** Largura máxima */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /** Centralizar conteúdo */
  centered?: boolean;
  /** Ocupar altura total disponível */
  fullHeight?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Mapeamento de paddings
 */
const paddingClasses: Record<string, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * Mapeamento de larguras máximas
 */
const maxWidthClasses: Record<string, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

/**
 * MainContent - Conteúdo principal
 *
 * @description Área principal de conteúdo do layout
 * com controle de padding e largura máxima
 *
 * @example
 * ```tsx
 * <MainContent>
 *   <PageContent />
 * </MainContent>
 * <MainContent padding="lg" maxWidth="xl" centered>
 *   <Dashboard />
 * </MainContent>
 * ```
 */
export const MainContent = React.memo(function MainContent({
  children,
  padding = "md",
  maxWidth = "full",
  centered = false,
  fullHeight = true,
  className,
}: MainContentProps) {
  return (
    <main
      className={cn(
        "flex-1 overflow-auto",
        paddingClasses[padding],
        fullHeight && "min-h-0",
        className
      )}
    >
      <div
        className={cn(
          "w-full",
          maxWidthClasses[maxWidth],
          centered && "mx-auto"
        )}
      >
        {children}
      </div>
    </main>
  );
});

MainContent.displayName = "MainContent";

export default MainContent;
export type { MainContentProps };
