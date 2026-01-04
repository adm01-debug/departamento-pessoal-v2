import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown, Check } from "lucide-react";

interface SortOption { key: string; label: string; }
interface TableSortProps { options: SortOption[]; sortKey: string | null; sortDirection: "asc" | "desc"; onSort: (key: string, direction: "asc" | "desc") => void; className?: string; }

export function TableSort({ options, sortKey, sortDirection, onSort, className }: TableSortProps) {
  const currentOption = options.find(o => o.key === sortKey);
  const handleKeyChange = (key: string) => onSort(key, sortDirection);
  const handleDirectionChange = (dir: string) => { if (sortKey) onSort(sortKey, dir as "asc" | "desc"); };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("", className)}>
          {sortKey ? (sortDirection === "asc" ? <ArrowUp className="h-4 w-4 mr-2" /> : <ArrowDown className="h-4 w-4 mr-2" />) : <ArrowUpDown className="h-4 w-4 mr-2" />}
          {currentOption ? `Ordenar: ${currentOption.label}` : "Ordenar"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuRadioGroup value={sortKey || ""} onValueChange={handleKeyChange}>
          {options.map(option => (<DropdownMenuRadioItem key={option.key} value={option.key}>{option.label}</DropdownMenuRadioItem>))}
        </DropdownMenuRadioGroup>
        {sortKey && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sortDirection} onValueChange={handleDirectionChange}>
              <DropdownMenuRadioItem value="asc"><ArrowUp className="h-4 w-4 mr-2" />Crescente</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="desc"><ArrowDown className="h-4 w-4 mr-2" />Decrescente</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default TableSort;
