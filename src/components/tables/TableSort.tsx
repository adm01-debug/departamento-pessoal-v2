import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown, Check } from "lucide-react";

interface SortOption { key: string; label: string; }
interface TableSortProps { options: SortOption[]; value: { key: string; direction: "asc" | "desc" } | null; onChange: (value: { key: string; direction: "asc" | "desc" } | null) => void; className?: string; }

export function TableSort({ options, value, onChange, className }: TableSortProps) {
  const handleSelect = (key: string) => {
    if (value?.key === key) { if (value.direction === "asc") onChange({ key, direction: "desc" }); else onChange(null); }
    else onChange({ key, direction: "asc" });
  };
  const currentOption = options.find(o => o.key === value?.key);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn("", className)}>
          {value ? (value.direction === "asc" ? <ArrowUp className="h-4 w-4 mr-2" /> : <ArrowDown className="h-4 w-4 mr-2" />) : <ArrowUpDown className="h-4 w-4 mr-2" />}
          {currentOption?.label || "Ordenar"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map(option => (
          <DropdownMenuItem key={option.key} onClick={() => handleSelect(option.key)}>
            <span className="flex-1">{option.label}</span>
            {value?.key === option.key && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default TableSort;
