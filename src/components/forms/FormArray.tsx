import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface FormArrayProps<T> { items: T[]; renderItem: (item: T, index: number, remove: () => void) => React.ReactNode; onAdd: () => void; onRemove: (index: number) => void; addLabel?: string; maxItems?: number; minItems?: number; className?: string; draggable?: boolean; }

export function FormArray<T>({ items, renderItem, onAdd, onRemove, addLabel = "Adicionar", maxItems, minItems = 0, className, draggable = false }: FormArrayProps<T>) {
  const canAdd = maxItems === undefined || items.length < maxItems;
  const canRemove = items.length > minItems;
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          {draggable && <GripVertical className="h-5 w-5 mt-2 text-muted-foreground cursor-move flex-shrink-0" />}
          <div className="flex-1">{renderItem(item, index, () => canRemove && onRemove(index))}</div>
          {canRemove && <Button type="button" variant="ghost" size="icon" className="mt-1 text-destructive hover:text-destructive" onClick={() => onRemove(index)}><Trash2 className="h-4 w-4" /></Button>}
        </div>
      ))}
      {canAdd && <Button type="button" variant="outline" size="sm" onClick={onAdd} className="w-full"><Plus className="h-4 w-4 mr-2" />{addLabel}</Button>}
    </div>
  );
}
export default FormArray;
