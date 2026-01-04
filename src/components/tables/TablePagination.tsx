import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface TablePaginationProps { page: number; pageSize: number; total: number; onPageChange: (page: number) => void; onPageSizeChange?: (size: number) => void; pageSizeOptions?: number[]; showPageSize?: boolean; showTotal?: boolean; showPageNumbers?: boolean; maxPageButtons?: number; className?: string; }

export function TablePagination({ page, pageSize, total, onPageChange, onPageSizeChange, pageSizeOptions = [10, 20, 50, 100], showPageSize = true, showTotal = true, showPageNumbers = true, maxPageButtons = 5, className }: TablePaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;
  const startItem = page * pageSize + 1;
  const endItem = Math.min((page + 1) * pageSize, total);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= maxPageButtons) { for (let i = 0; i < totalPages; i++) pages.push(i); }
    else {
      const half = Math.floor(maxPageButtons / 2);
      let start = Math.max(0, page - half);
      let end = Math.min(totalPages - 1, page + half);
      if (page <= half) end = maxPageButtons - 1;
      if (page >= totalPages - half - 1) start = totalPages - maxPageButtons;
      if (start > 0) { pages.push(0); if (start > 1) pages.push("..."); }
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) { if (end < totalPages - 2) pages.push("..."); pages.push(totalPages - 1); }
    }
    return pages;
  };

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 text-sm", className)}>
      <div className="flex items-center gap-4">
        {showTotal && <span className="text-muted-foreground">{total > 0 ? `${startItem}-${endItem} de ${total} itens` : "0 itens"}</span>}
        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Itens por página:</span>
            <Select value={String(pageSize)} onValueChange={v => onPageSizeChange(Number(v))}><SelectTrigger className="w-[70px] h-8"><SelectValue /></SelectTrigger><SelectContent>{pageSizeOptions.map(size => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent></Select>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(0)} disabled={!canPrev}><ChevronsLeft className="h-4 w-4" /></Button>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(page - 1)} disabled={!canPrev}><ChevronLeft className="h-4 w-4" /></Button>
        {showPageNumbers && getPageNumbers().map((p, i) => p === "..." ? <span key={i} className="px-2">...</span> : <Button key={i} variant={p === page ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => onPageChange(p as number)}>{(p as number) + 1}</Button>)}
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(page + 1)} disabled={!canNext}><ChevronRight className="h-4 w-4" /></Button>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(totalPages - 1)} disabled={!canNext}><ChevronsRight className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
export default TablePagination;
