import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface TablePaginationProps { currentPage: number; totalPages: number; pageSize: number; totalItems: number; onPageChange: (page: number) => void; onPageSizeChange?: (size: number) => void; pageSizeOptions?: number[]; className?: string; }

export function TablePagination({ currentPage, totalPages, pageSize, totalItems, onPageChange, onPageSizeChange, pageSizeOptions = [10, 20, 50, 100], className }: TablePaginationProps) {
  return (
    <div className={cn("flex items-center justify-between px-2", className)}>
      <div className="text-sm text-muted-foreground">{totalItems} itens</div>
      <div className="flex items-center gap-4">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Por página:</span>
            <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
              <SelectTrigger className="w-[70px]"><SelectValue /></SelectTrigger>
              <SelectContent>{pageSizeOptions.map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={() => onPageChange(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm px-2">{currentPage} / {totalPages}</span>
          <Button variant="outline" size="icon" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}><ChevronsRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
export default TablePagination;
