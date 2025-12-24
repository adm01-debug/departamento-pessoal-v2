/**
 * @module TableHeader
 * @description Cabeçalho de tabela customizado
 * @category Table
 */

import React from "react";
import { TableHead } from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Direção de ordenação
 */
type SortDirection = "asc" | "desc" | null;

/**
 * Props do componente TableHeader
 */
interface TableHeaderProps {
  /** Texto do header */
  children: React.ReactNode;
  /** Coluna sortável */
  sortable?: boolean;
  /** Direção atual de sort */
  sortDirection?: SortDirection;
  /** Callback ao clicar para sort */
  onSort?: () => void;
  /** Alinhamento */
  align?: "left" | "center" | "right";
  /** Largura da coluna */
  width?: string | number;
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
 * TableHeader - Cabeçalho de coluna
 *
 * @description Header de tabela com suporte a ordenação
 * e alinhamento customizado
 *
 * @example
 * ```tsx
 * <TableHeader>Nome</TableHeader>
 * <TableHeader sortable sortDirection="asc" onSort={handleSort}>
 *   Data
 * </TableHeader>
 * <TableHeader align="right">Valor</TableHeader>
 * ```
 */
export const TableHeader = React.memo(function TableHeader({
  children,
  sortable = false,
  sortDirection,
  onSort,
  align = "left",
  width,
  className,
}: TableHeaderProps) {
  // Ícone de ordenação
  const SortIcon = sortDirection === "asc" 
    ? ArrowUp 
    : sortDirection === "desc" 
      ? ArrowDown 
      : ArrowUpDown;

  const style: React.CSSProperties = width
    ? { width: typeof width === "number" ? `${width}px` : width }
    : {};

  if (!sortable) {
    return (
      <TableHead
        style={style}
        className={cn(alignClasses[align], className)}
      >
        {children}
      </TableHead>
    );
  }

  return (
    <TableHead
      style={style}
      className={cn(alignClasses[align], className)}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={onSort}
        className="-ml-3 h-8 data-[state=open]:bg-accent"
      >
        {children}
        <SortIcon className="ml-2 h-4 w-4" />
      </Button>
    </TableHead>
  );
});

TableHeader.displayName = "TableHeader";

export default TableHeader;
export type { TableHeaderProps, SortDirection };
