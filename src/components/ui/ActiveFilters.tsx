import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Filter {
  key: string;
  label: string;
  value: string;
}

interface ActiveFiltersProps {
  filters: Filter[];
  onRemove: (key: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export function ActiveFilters({ filters, onRemove, onClearAll, className }: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-sm text-muted-foreground">Filtros ativos:</span>
      {filters.map((filter) => (
        <Badge key={filter.key} variant="secondary" className="gap-1 pr-1">
          <span className="text-muted-foreground">{filter.label}:</span> {filter.value}
          <button onClick={() => onRemove(filter.key)} className="ml-1 hover:bg-muted rounded">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      {onClearAll && filters.length > 1 && (
        <Button variant="ghost" size="sm" onClick={onClearAll}>Limpar todos</Button>
      )}
    </div>
  );
}
export default ActiveFilters;
