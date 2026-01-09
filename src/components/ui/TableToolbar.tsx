import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, RefreshCw, Plus } from "lucide-react";

interface TableToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onAdd?: () => void;
  addLabel?: string;
  onFilter?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function TableToolbar({ searchValue, onSearchChange, searchPlaceholder = "Buscar...", onAdd, addLabel = "Adicionar", onFilter, onRefresh, isRefreshing, children, className }: TableToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 mb-4", className)}>
      {onSearchChange && (
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={searchPlaceholder} value={searchValue} onChange={(e) => onSearchChange(e.target.value)} className="pl-9" />
        </div>
      )}
      {children}
      <div className="flex items-center gap-2 ml-auto">
        {onFilter && <Button variant="outline" size="sm" onClick={onFilter}><Filter className="h-4 w-4 mr-2" />Filtros</Button>}
        {onRefresh && <Button variant="outline" size="icon" onClick={onRefresh} disabled={isRefreshing}><RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} /></Button>}
        {onAdd && <Button size="sm" onClick={onAdd}><Plus className="h-4 w-4 mr-2" />{addLabel}</Button>}
      </div>
    </div>
  );
}
export default TableToolbar;
