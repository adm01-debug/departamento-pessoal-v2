/**
 * @module Grid
 * @description Sistema de grid responsivo
 * @category Layout
 */

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Props do componente Grid
 */
interface GridProps {
  /** Conteúdo (colunas) */
  children: React.ReactNode;
  /** Número de colunas */
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  /** Gap entre itens */
  gap?: "none" | "sm" | "md" | "lg" | "xl";
  /** Alinhamento dos itens */
  align?: "start" | "center" | "end" | "stretch";
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Mapeamento de colunas
 */
const colsClasses: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
  6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  12: "grid-cols-12",
};

/**
 * Mapeamento de gaps
 */
const gapClasses: Record<string, string> = {
  none: "gap-0",
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
};

/**
 * Grid - Sistema de grid
 *
 * @description Layout grid responsivo para organização
 * de conteúdo em colunas
 *
 * @example
 * ```tsx
 * <Grid cols={3} gap="md">
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </Grid>
 * <Grid cols={12}>
 *   <Column span={8}>Conteúdo</Column>
 *   <Column span={4}>Sidebar</Column>
 * </Grid>
 * ```
 */
export const Grid = React.memo(function Grid({
  children,
  cols = 12,
  gap = "md",
  align = "stretch",
  className,
}: GridProps) {
  return (
    <div
      className={cn(
        "grid",
        colsClasses[cols],
        gapClasses[gap],
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
});

Grid.displayName = "Grid";

export default Grid;
export type { GridProps };
