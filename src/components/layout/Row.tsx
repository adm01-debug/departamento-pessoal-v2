/**
 * @module Row
 * @description Linha flexbox para layout
 * @category Layout
 */

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Props do componente Row
 */
interface RowProps {
  /** Conteúdo da linha */
  children: React.ReactNode;
  /** Espaçamento entre itens */
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  /** Alinhamento vertical */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  /** Justificação horizontal */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  /** Quebra de linha */
  wrap?: boolean;
  /** Direção reversa */
  reverse?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Mapeamento de gaps
 */
const gapClasses: Record<string, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

/**
 * Mapeamento de alinhamentos
 */
const alignClasses: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

/**
 * Mapeamento de justificações
 */
const justifyClasses: Record<string, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

/**
 * Row - Linha flexbox
 *
 * @description Componente de layout em linha com
 * controle de gap, alinhamento e justificação
 *
 * @example
 * ```tsx
 * <Row gap="md" align="center" justify="between">
 *   <Logo />
 *   <Navigation />
 *   <UserMenu />
 * </Row>
 * ```
 */
export const Row = React.memo(function Row({
  children,
  gap = "md",
  align = "center",
  justify = "start",
  wrap = false,
  reverse = false,
  className,
}: RowProps) {
  return (
    <div
      className={cn(
        "flex",
        reverse ? "flex-row-reverse" : "flex-row",
        wrap && "flex-wrap",
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
    >
      {children}
    </div>
  );
});

Row.displayName = "Row";

export default Row;
export type { RowProps };
