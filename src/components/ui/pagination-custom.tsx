import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
interface PaginationProps { currentPage: number; totalPages: number; onPageChange: (page: number) => void; totalItems?: number; itemsPerPage?: number; }
export function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }: PaginationProps) {
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  const startItem = totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem = totalItems && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems) : null;
  return (
    <div className="flex items-center justify-between py-4"><div className="text-sm text-muted-foreground">{totalItems && startItem && endItem && <span>Mostrando {startItem}-{endItem} de {totalItems}</span>}</div><div className="flex items-center gap-1"><Button variant="outline" size="icon" onClick={() => onPageChange(1)} disabled={!canGoPrev}><ChevronsLeft className="h-4 w-4" /></Button><Button variant="outline" size="icon" onClick={() => onPageChange(currentPage - 1)} disabled={!canGoPrev}><ChevronLeft className="h-4 w-4" /></Button><span className="px-4 text-sm">{currentPage} de {totalPages}</span><Button variant="outline" size="icon" onClick={() => onPageChange(currentPage + 1)} disabled={!canGoNext}><ChevronRight className="h-4 w-4" /></Button><Button variant="outline" size="icon" onClick={() => onPageChange(totalPages)} disabled={!canGoNext}><ChevronsRight className="h-4 w-4" /></Button></div></div>
  );
}
export default Pagination;
