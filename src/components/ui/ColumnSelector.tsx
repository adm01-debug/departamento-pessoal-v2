import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Columns, RotateCcw } from "lucide-react";

interface Column {
  id: string;
  label: string;
  visible: boolean;
  required?: boolean;
}

interface ColumnSelectorProps {
  columns: Column[];
  onChange: (columns: Column[]) => void;
  onReset?: () => void;
  className?: string;
}

export function ColumnSelector({ columns, onChange, onReset, className }: ColumnSelectorProps) {
  const toggleColumn = (id: string) => {
    onChange(columns.map((col) => col.id === id ? { ...col, visible: !col.visible } : col));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}><Columns className="h-4 w-4 mr-2" />Colunas</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Colunas visíveis</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((col) => (
          <DropdownMenuCheckboxItem key={col.id} checked={col.visible} disabled={col.required} onCheckedChange={() => toggleColumn(col.id)}>
            {col.label}
          </DropdownMenuCheckboxItem>
        ))}
        {onReset && (
          <>
            <DropdownMenuSeparator />
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={onReset}>
              <RotateCcw className="h-4 w-4 mr-2" />Restaurar padrão
            </Button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default ColumnSelector;
