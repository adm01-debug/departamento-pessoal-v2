/**
 * @module TableCell
 * @description Célula de tabela customizada
 * @category Table
 */

import React from "react";
import { TableCell as UITableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

/**
 * Props do componente TableCell
 */
interface TableCellProps {
  /** Conteúdo da célula */
  children: React.ReactNode;
  /** Alinhamento */
  align?: "left" | "center" | "right";
  /** Colspan */
  colSpan?: number;
  /** Rowspan */
  rowSpan?: number;
  /** Truncar texto longo */
  truncate?: boolean;
  /** Largura máxima */
  maxWidth?: string | number;
  /** Padding compacto */
  compact?: boolean;
  /** Célula clicável */
  onClick?: () => void;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Mapeamento de alinhamento
 */
const alignClasses: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

/**
 * TableCell - Célula de tabela
 *
 * @description Wrapper para células de tabela com
 * opções de formatação e comportamento
 *
 * @example
 * ```tsx
 * <TableCell>Texto normal</TableCell>
 * <TableCell align="right">R$ 1.000,00</TableCell>
 * <TableCell truncate maxWidth={200}>Texto muito longo...</TableCell>
 * ```
 */
export const TableCell = React.memo(function TableCell({
  children,
  align = "left",
  colSpan,
  rowSpan,
  truncate = false,
  maxWidth,
  compact = false,
  onClick,
  className,
}: TableCellProps) {
  const style: React.CSSProperties = maxWidth
    ? { maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth }
    : {};

  return (
    <UITableCell
      colSpan={colSpan}
      rowSpan={rowSpan}
      onClick={onClick}
      style={style}
      className={cn(
        alignClasses[align],
        truncate && "truncate",
        compact && "py-2",
        onClick && "cursor-pointer hover:bg-muted/50",
        className
      )}
    >
      {children}
    </UITableCell>
  );
});

TableCell.displayName = "TableCell";

export default TableCell;
export type { TableCellProps };
