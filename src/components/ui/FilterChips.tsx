import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterChip { key: string; label: string; value: string; }
interface FilterChipsProps { filters: FilterChip[]; onRemove: (key: string) => void; onClearAll?: () => void; className?: string; }

export function FilterChips({ filters, onRemove, onClearAll, className }: FilterChipsProps) {
  if (filters.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {filters.map((filter) => (
        <Badge key={filter.key} variant="secondary" className="gap-1">
          <span className="text-muted-foreground">{filter.label}:</span>
          <span>{filter.value}</span>
          <button onClick={() => onRemove(filter.key)} className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button>
        </Badge>
      ))}
      {onClearAll && filters.length > 1 && <button className="text-xs text-muted-foreground hover:text-foreground" onClick={onClearAll}>Limpar todos</button>}
    </div>
  );
}
export default FilterChips;
