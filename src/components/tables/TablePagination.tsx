import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface TablePaginationProps { page: number; pageSize: number; total: number; onPageChange: (page: number) => void; onPageSizeChange?: (size: number) => void; pageSizeOptions?: number[]; className?: string; showInfo?: boolean; }

export function TablePagination({ page, pageSize, total, onPageChange, onPageSizeChange, pageSizeOptions = [10, 25, 50, 100], className, showInfo = true }: TablePaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, total);

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {showInfo && <div className="text-sm text-muted-foreground">{total > 0 ? `${start}-${end} de ${total}` : "Nenhum item"}</div>}
      <div className="flex items-center gap-2">
        {onPageSizeChange && (
          <div className="flex items-center gap-2"><span className="text-sm text-muted-foreground">Itens por página</span>
            <Select value={String(pageSize)} onValueChange={v => onPageSizeChange(Number(v))}><SelectTrigger className="w-[70px] h-8"><SelectValue /></SelectTrigger><SelectContent>{pageSizeOptions.map(size => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent></Select>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(0)} disabled={page === 0}><ChevronsLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(page - 1)} disabled={page === 0}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm min-w-[80px] text-center">Página {page + 1} de {totalPages || 1}</span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages - 1}><ChevronRight className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(totalPages - 1)} disabled={page >= totalPages - 1}><ChevronsRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
export default TablePagination;
