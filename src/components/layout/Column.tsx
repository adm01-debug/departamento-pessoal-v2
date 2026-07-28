/**
 * @module Column
 * @description Coluna flexível para layouts
 * @category Layout
 */

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Props do componente Column
 */
interface ColumnProps {
  /** Conteúdo da coluna */
  children: React.ReactNode;
  /** Proporção da coluna (1-12) */
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /** Gap interno */
  gap?: "none" | "sm" | "md" | "lg";
  /** Alinhamento horizontal */
  align?: "start" | "center" | "end" | "stretch";
  /** Alinhamento vertical */
  justify?: "start" | "center" | "end" | "between" | "around";
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Mapeamento de spans
 */
const spanClasses: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};

/**
 * Mapeamento de gaps
 */
const gapClasses: Record<string, string> = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

/**
 * Mapeamento de alinhamentos
 */
const alignClasses: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

/**
 * Mapeamento de justificação
 */
const justifyClasses: Record<string, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

/**
 * Column - Coluna de layout
 *
 * @description Coluna flexível para uso dentro de Grid
 * com controle de proporção e alinhamento
 *
 * @example
 * ```tsx
 * <Grid>
 *   <Column span={6}>Metade esquerda</Column>
 *   <Column span={6}>Metade direita</Column>
 * </Grid>
 * <Column span={4} align="center">
 *   Conteúdo centralizado
 * </Column>
 * ```
 */
export const Column = React.memo(function Column({
  children,
  span,
  gap = "none",
  align = "stretch",
  justify = "start",
  className,
}: ColumnProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        span && spanClasses[span],
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

Column.displayName = "Column";

export default Column;
export type { ColumnProps };
