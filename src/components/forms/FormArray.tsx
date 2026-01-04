import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";

interface FormArrayProps<T> { items: T[]; renderItem: (item: T, index: number, remove: () => void) => React.ReactNode; onAdd: () => void; onRemove: (index: number) => void; onReorder?: (fromIndex: number, toIndex: number) => void; addLabel?: string; minItems?: number; maxItems?: number; className?: string; emptyMessage?: string; }

export function FormArray<T>({ items, renderItem, onAdd, onRemove, onReorder, addLabel = "Adicionar item", minItems = 0, maxItems = Infinity, className, emptyMessage = "Nenhum item adicionado" }: FormArrayProps<T>) {
  const canAdd = items.length < maxItems;
  const canRemove = items.length > minItems;

  const moveItem = (index: number, direction: "up" | "down") => {
    if (!onReorder) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < items.length) onReorder(index, newIndex);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {items.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg border-dashed">{emptyMessage}</p> : (
        items.map((item, index) => (
          <Card key={index} className="p-3">
            <div className="flex items-start gap-2">
              {onReorder && (
                <div className="flex flex-col gap-1 pt-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveItem(index, "up")} disabled={index === 0}><ChevronUp className="h-3 w-3" /></Button>
                  <GripVertical className="h-4 w-4 text-muted-foreground mx-auto" />
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveItem(index, "down")} disabled={index === items.length - 1}><ChevronDown className="h-3 w-3" /></Button>
                </div>
              )}
              <div className="flex-1">{renderItem(item, index, () => onRemove(index))}</div>
              {canRemove && <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onRemove(index)}><Trash2 className="h-4 w-4" /></Button>}
            </div>
          </Card>
        ))
      )}
      {canAdd && <Button variant="outline" className="w-full" onClick={onAdd}><Plus className="h-4 w-4 mr-2" />{addLabel}</Button>}
    </div>
  );
}
export default FormArray;
