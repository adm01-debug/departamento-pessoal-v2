import React from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface SelectableListProps<T> { items: T[]; selected: string[]; onSelectionChange: (selected: string[]) => void; keyExtractor: (item: T) => string; renderItem: (item: T) => React.ReactNode; className?: string; }

export function SelectableList<T>({ items, selected, onSelectionChange, keyExtractor, renderItem, className }: SelectableListProps<T>) {
  const toggle = (key: string) => { if (selected.includes(key)) onSelectionChange(selected.filter((k) => k !== key)); else onSelectionChange([...selected, key]); };
  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => { const key = keyExtractor(item); return (
        <div key={key} className="flex items-center gap-3 p-2 border rounded hover:bg-muted">
          <Checkbox checked={selected.includes(key)} onCheckedChange={() => toggle(key)} />
          <div className="flex-1">{renderItem(item)}</div>
        </div>
      ); })}
    </div>
  );
}
export default SelectableList;
