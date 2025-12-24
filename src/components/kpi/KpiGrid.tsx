/**
 * @module KpiGrid
 * @description Grid responsivo para exibição de KPIs
 * @category KPI
 */

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Props do componente KpiGrid
 */
interface KpiGridProps {
  /** Elementos filhos (KpiCards) */
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
  6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
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
 * KpiGrid - Grid responsivo para KPIs
 *
 * @description Layout grid responsivo para organizar
 * múltiplos cards de KPI de forma visualmente agradável
 *
 * @example
 * ```tsx
 * <KpiGrid columns={4} gap="md">
 *   <KpiCard title="Vendas" value="R$ 50.000" />
 *   <KpiCard title="Clientes" value="1.250" />
 *   <KpiCard title="Pedidos" value="890" />
 *   <KpiCard title="Ticket Médio" value="R$ 56" />
 * </KpiGrid>
 * ```
 */
export const KpiGrid = React.memo(function KpiGrid({
  children,
  columns = 4,
  gap = "md",
  className,
}: KpiGridProps) {
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

KpiGrid.displayName = "KpiGrid";

export default KpiGrid;
export type { KpiGridProps };
