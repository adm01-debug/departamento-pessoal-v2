import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bookmark, Plus, Trash2 } from "lucide-react";

interface SavedFilter {
  id: string;
  name: string;
  filters: Record<string, any>;
}

interface SavedFiltersProps {
  filters: SavedFilter[];
  onSelect: (filter: SavedFilter) => void;
  onSave?: () => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export function SavedFilters({ filters, onSelect, onSave, onDelete, className }: SavedFiltersProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}><Bookmark className="h-4 w-4 mr-2" />Filtros salvos</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {filters.map((filter) => (
          <DropdownMenuItem key={filter.id} className="flex items-center justify-between">
            <span onClick={() => onSelect(filter)}>{filter.name}</span>
            {onDelete && (
              <button onClick={(e) => { e.stopPropagation(); onDelete(filter.id); }} className="ml-2 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </DropdownMenuItem>
        ))}
        {filters.length === 0 && <DropdownMenuItem disabled>Nenhum filtro salvo</DropdownMenuItem>}
        {onSave && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSave}><Plus className="h-4 w-4 mr-2" />Salvar filtro atual</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default SavedFilters;
