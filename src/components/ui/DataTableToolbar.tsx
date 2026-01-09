import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Plus } from "lucide-react";

interface DataTableToolbarProps { searchValue?: string; onSearchChange?: (value: string) => void; onFilter?: () => void; onExport?: () => void; onAdd?: () => void; addLabel?: string; className?: string; }

export function DataTableToolbar({ searchValue, onSearchChange, onFilter, onExport, onAdd, addLabel = "Adicionar", className }: DataTableToolbarProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 mb-4", className)}>
      <div className="flex items-center gap-2 flex-1">
        {onSearchChange && (
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar..." value={searchValue} onChange={(e) => onSearchChange(e.target.value)} className="pl-10" />
          </div>
        )}
        {onFilter && <Button variant="outline" onClick={onFilter}><Filter className="h-4 w-4 mr-2" />Filtros</Button>}
      </div>
      <div className="flex items-center gap-2">
        {onExport && <Button variant="outline" onClick={onExport}><Download className="h-4 w-4 mr-2" />Exportar</Button>}
        {onAdd && <Button onClick={onAdd}><Plus className="h-4 w-4 mr-2" />{addLabel}</Button>}
      </div>
    </div>
  );
}
export default DataTableToolbar;
