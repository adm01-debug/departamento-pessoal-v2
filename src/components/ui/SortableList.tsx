import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { GripVertical, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortableItem {
  id: string;
  content: React.ReactNode;
}

interface SortableListProps {
  items: SortableItem[];
  className?: string;
  onReorder?: (items: SortableItem[]) => void;
  onRemove?: (id: string) => void;
  renderItem?: (item: SortableItem, index: number) => React.ReactNode;
}

export function SortableList({ items: initialItems, className, onReorder, onRemove, renderItem }: SortableListProps) {
  const [items, setItems] = useState(initialItems);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= items.length) return;
    const newItems = [...items];
    const [removed] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, removed);
    setItems(newItems);
    onReorder?.(newItems);
  };

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    moveItem(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => { setDraggedIndex(null); };

  const handleRemove = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    onRemove?.(id);
  };

  return (
    <ul className={cn("space-y-2", className)}>
      {items.map((item, index) => (
        <li key={item.id} draggable onDragStart={handleDragStart(index)} onDragOver={handleDragOver(index)} onDragEnd={handleDragEnd} className={cn("flex items-center gap-2 p-3 bg-card border rounded-lg cursor-move transition-all", draggedIndex === index && "opacity-50 scale-95")}>
          <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div className="flex-1">{renderItem ? renderItem(item, index) : item.content}</div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => moveItem(index, index - 1)} disabled={index === 0}><ChevronUp className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => moveItem(index, index + 1)} disabled={index === items.length - 1}><ChevronDown className="h-4 w-4" /></Button>
            {onRemove && <Button variant="ghost" size="icon" onClick={() => handleRemove(item.id)}><Trash2 className="h-4 w-4" /></Button>}
          </div>
        </li>
      ))}
    </ul>
  );
}
export default SortableList;
