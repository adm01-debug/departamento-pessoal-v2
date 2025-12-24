/**
 * @module TableRow
 * @description Linha de tabela customizada
 * @category Table
 */

import React from "react";
import { TableRow as UITableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

/**
 * Props do componente TableRow
 */
interface TableRowProps {
  /** Células da linha */
  children: React.ReactNode;
  /** Linha selecionada */
  selected?: boolean;
  /** Linha destacada */
  highlighted?: boolean;
  /** Linha clicável */
  onClick?: () => void;
  /** Efeito hover */
  hoverable?: boolean;
  /** Linha desabilitada */
  disabled?: boolean;
  /** Variante de status */
  status?: "default" | "success" | "warning" | "error";
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Mapeamento de status para cores
 */
const statusClasses: Record<string, string> = {
  default: "",
  success: "bg-green-50 hover:bg-green-100",
  warning: "bg-yellow-50 hover:bg-yellow-100",
  error: "bg-red-50 hover:bg-red-100",
};

/**
 * TableRow - Linha de tabela
 *
 * @description Wrapper para linhas de tabela com
 * estados visuais e comportamentos interativos
 *
 * @example
 * ```tsx
 * <TableRow>
 *   <TableCell>Conteúdo</TableCell>
 * </TableRow>
 * <TableRow selected onClick={handleClick}>
 *   <TableCell>Selecionado</TableCell>
 * </TableRow>
 * <TableRow status="error">
 *   <TableCell>Com erro</TableCell>
 * </TableRow>
 * ```
 */
export const TableRow = React.memo(function TableRow({
  children,
  selected = false,
  highlighted = false,
  onClick,
  hoverable = true,
  disabled = false,
  status = "default",
  className,
}: TableRowProps) {
  return (
    <UITableRow
      onClick={disabled ? undefined : onClick}
      className={cn(
        statusClasses[status],
        selected && "bg-primary/10",
        highlighted && "bg-yellow-100",
        hoverable && !disabled && "hover:bg-muted/50",
        onClick && !disabled && "cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      data-selected={selected}
      data-disabled={disabled}
    >
      {children}
    </UITableRow>
  );
});

TableRow.displayName = "TableRow";

export default TableRow;
export type { TableRowProps };
