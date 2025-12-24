/**
 * @module Container
 * @description Container responsivo para centralização de conteúdo
 * @category Layout
 */

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Tamanhos máximos disponíveis
 */
type ContainerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

/**
 * Props do componente Container
 */
interface ContainerProps {
  /** Conteúdo */
  children: React.ReactNode;
  /** Tamanho máximo */
  size?: ContainerSize;
  /** Centralizar horizontalmente */
  centered?: boolean;
  /** Padding horizontal */
  padding?: "none" | "sm" | "md" | "lg";
  /** Elemento HTML */
  as?: "div" | "main" | "section" | "article";
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Mapeamento de tamanhos
 */
const sizeClasses: Record<ContainerSize, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

/**
 * Mapeamento de paddings
 */
const paddingClasses: Record<string, string> = {
  none: "px-0",
  sm: "px-4",
  md: "px-6",
  lg: "px-8",
};

/**
 * Container - Container responsivo
 *
 * @description Container centralizado com largura máxima
 * responsiva para organização de conteúdo
 *
 * @example
 * ```tsx
 * <Container size="lg">
 *   <h1>Conteúdo centralizado</h1>
 * </Container>
 * <Container as="main" size="xl" padding="lg">
 *   <PageContent />
 * </Container>
 * ```
 */
export const Container = React.memo(function Container({
  children,
  size = "xl",
  centered = true,
  padding = "md",
  as: Component = "div",
  className,
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "w-full",
        sizeClasses[size],
        paddingClasses[padding],
        centered && "mx-auto",
        className
      )}
    >
      {children}
    </Component>
  );
});

Container.displayName = "Container";

export default Container;
export type { ContainerProps, ContainerSize };
