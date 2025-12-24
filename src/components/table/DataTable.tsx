/**
 * @module DataTable
 * @description Tabela de dados com funcionalidades completas
 * @category Table
 */

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/**
 * Definição de coluna
 */
interface ColumnDef<T> {
  /** ID único da coluna */
  id: string;
  /** Header da coluna */
  header: string | React.ReactNode;
  /** Acessor do dado */
  accessorKey?: keyof T;
  /** Função de renderização customizada */
  cell?: (row: T) => React.ReactNode;
  /** Largura da coluna */
  width?: string | number;
  /** Alinhamento */
  align?: "left" | "center" | "right";
  /** Coluna sortável */
  sortable?: boolean;
}

/**
 * Props do componente DataTable
 */
interface DataTableProps<T> {
  /** Dados da tabela */
  data: T[];
  /** Definição das colunas */
  columns: ColumnDef<T>[];
  /** Função para obter key única de cada row */
  getRowKey: (row: T) => string;
  /** Loading state */
  isLoading?: boolean;
  /** Mensagem quando vazio */
  emptyMessage?: string;
  /** Callback ao clicar em uma row */
  onRowClick?: (row: T) => void;
  /** Striped rows */
  striped?: boolean;
  /** Hover effect */
  hoverable?: boolean;
  /** Compact mode */
  compact?: boolean;
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
 * DataTable - Tabela de dados completa
 *
 * @description Tabela flexível com suporte a colunas customizadas,
 * loading state, empty state e interações
 *
 * @example
 * ```tsx
 * <DataTable
 *   data={users}
 *   columns={[
 *     { id: "name", header: "Nome", accessorKey: "name" },
 *     { id: "email", header: "Email", accessorKey: "email" },
 *     { id: "actions", header: "Ações", cell: (row) => <Button /> },
 *   ]}
 *   getRowKey={(row) => row.id}
 * />
 * ```
 */
export function DataTable<T>({
  data,
  columns,
  getRowKey,
  isLoading = false,
  emptyMessage = "Nenhum registro encontrado",
  onRowClick,
  striped = false,
  hoverable = true,
  compact = false,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.id}
                style={{ width: column.width }}
                className={cn(alignClasses[column.align || "left"])}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                  <span className="text-muted-foreground">Carregando...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-8 text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow
                key={getRowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  onRowClick && "cursor-pointer",
                  hoverable && "hover:bg-muted/50",
                  striped && rowIndex % 2 === 1 && "bg-muted/30"
                )}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    className={cn(
                      alignClasses[column.align || "left"],
                      compact && "py-2"
                    )}
                  >
                    {column.cell
                      ? column.cell(row)
                      : column.accessorKey
                        ? String(row[column.accessorKey] ?? "")
                        : null}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

DataTable.displayName = "DataTable";

export default DataTable;
export type { DataTableProps, ColumnDef };
