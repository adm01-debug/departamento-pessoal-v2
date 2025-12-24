/**
 * @module StatGrid
 * @description Grid responsivo para exibição de estatísticas
 * @category Stats
 */

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Props do componente StatGrid
 */
interface StatGridProps {
  /** Elementos filhos (StatCards) */
  children: React.ReactNode;
  /** Número de colunas */
  columns?: 2 | 3 | 4 | 5 | 6;
  /** Gap entre itens */
  gap?: "sm" | "md" | "lg";
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Mapeamento de colunas para classes CSS
 */
const columnClasses: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
  6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
};

/**
 * Mapeamento de gap para classes CSS
 */
const gapClasses: Record<string, string> = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

/**
 * StatGrid - Grid para estatísticas
 *
 * @description Layout grid responsivo para organizar
 * múltiplos cards de estatísticas de forma consistente
 *
 * @example
 * ```tsx
 * <StatGrid columns={4} gap="md">
 *   <StatCard title="Total" value={1000} />
 *   <StatCard title="Ativos" value={800} />
 *   <StatCard title="Inativos" value={200} />
 *   <StatCard title="Média" value={500} />
 * </StatGrid>
 * ```
 */
export const StatGrid = React.memo(function StatGrid({
  children,
  columns = 4,
  gap = "md",
  className,
}: StatGridProps) {
  return (
    <div
      className={cn(
        "grid",
        columnClasses[columns],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
});

StatGrid.displayName = "StatGrid";

export default StatGrid;
export type { StatGridProps };
