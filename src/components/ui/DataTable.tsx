import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  pageSize?: number;
  selectable?: boolean;
  searchable?: boolean;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
}

export function DataTable<T extends { id: string | number }>({ data, columns, className, pageSize = 10, selectable = false, searchable = true, onRowClick, onSelectionChange }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  const filteredData = useMemo(() => {
    let result = [...data];
    if (searchTerm) {
      result = result.filter(row => Object.values(row).some(value => String(value).toLowerCase().includes(searchTerm.toLowerCase())));
    }
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = (a as any)[sortKey];
        const bVal = (b as any)[sortKey];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortOrder === "asc" ? comparison : -comparison;
      });
    }
    return result;
  }, [data, searchTerm, sortKey, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortOrder("asc"); }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
      onSelectionChange?.([]);
    } else {
      const newSelected = new Set(paginatedData.map(row => row.id));
      setSelectedIds(newSelected);
      onSelectionChange?.(paginatedData);
    }
  };

  const toggleSelect = (row: T) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(row.id)) newSelected.delete(row.id);
    else newSelected.add(row.id);
    setSelectedIds(newSelected);
    onSelectionChange?.(data.filter(r => newSelected.has(r.id)));
  };

  const getValue = (row: T, key: string) => {
    const keys = key.split(".");
    let value: any = row;
    for (const k of keys) value = value?.[k];
    return value;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {searchable && (
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="pl-8" />
        </div>
      )}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-10">
                  <Checkbox checked={selectedIds.size === paginatedData.length && paginatedData.length > 0} onCheckedChange={toggleSelectAll} />
                </TableHead>
              )}
              {columns.map(col => (
                <TableHead key={String(col.key)} style={{ width: col.width }}>
                  {col.sortable ? (
                    <Button variant="ghost" size="sm" className="-ml-3" onClick={() => handleSort(String(col.key))}>
                      {col.header}
                      {sortKey === col.key ? (sortOrder === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />) : <ArrowUpDown className="ml-1 h-4 w-4" />}
                    </Button>
                  ) : col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map(row => (
              <TableRow key={row.id} className={cn(onRowClick && "cursor-pointer", selectedIds.has(row.id) && "bg-muted")} onClick={() => onRowClick?.(row)}>
                {selectable && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={selectedIds.has(row.id)} onCheckedChange={() => toggleSelect(row)} />
                  </TableCell>
                )}
                {columns.map(col => (
                  <TableCell key={String(col.key)}>
                    {col.render ? col.render(getValue(row, String(col.key)), row) : getValue(row, String(col.key))}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Mostrando {paginatedData.length} de {filteredData.length} itens</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm">Página {currentPage} de {totalPages}</span>
          <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
export default DataTable;
