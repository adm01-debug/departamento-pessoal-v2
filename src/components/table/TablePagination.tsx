/**
 * @module TablePagination
 * @description Paginação para tabelas
 * @category Table
 */

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * Props do componente TablePagination
 */
interface TablePaginationProps {
  /** Página atual (1-indexed) */
  currentPage: number;
  /** Total de páginas */
  totalPages: number;
  /** Total de registros */
  totalItems: number;
  /** Itens por página */
  pageSize: number;
  /** Opções de page size */
  pageSizeOptions?: number[];
  /** Callback ao mudar página */
  onPageChange: (page: number) => void;
  /** Callback ao mudar page size */
  onPageSizeChange?: (size: number) => void;
  /** Mostrar seletor de page size */
  showPageSize?: boolean;
  /** Mostrar info de itens */
  showItemCount?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * TablePagination - Paginação de tabela
 *
 * @description Controles de paginação com navegação,
 * seleção de itens por página e informações de contagem
 *
 * @example
 * ```tsx
 * <TablePagination
 *   currentPage={1}
 *   totalPages={10}
 *   totalItems={100}
 *   pageSize={10}
 *   onPageChange={setPage}
 *   onPageSizeChange={setPageSize}
 * />
 * ```
 */
export const TablePagination = React.memo(function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
  showPageSize = true,
  showItemCount = true,
  className,
}: TablePaginationProps) {
  // Calcular range de itens exibidos
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      className={cn(
        "flex items-center justify-between px-2 py-4",
        className
      )}
    >
      {/* Info de itens */}
      {showItemCount && (
        <p className="text-sm text-muted-foreground">
          Mostrando {startItem} a {endItem} de {totalItems} registros
        </p>
      )}

      <div className="flex items-center gap-4">
        {/* Seletor de page size */}
        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Por página:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(v) => onPageSizeChange(Number(v))}
            >
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Navegação */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm px-2">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});

TablePagination.displayName = "TablePagination";

export default TablePagination;
export type { TablePaginationProps };
