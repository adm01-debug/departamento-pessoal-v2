import React from "react";
import { cn } from "@/lib/utils";

interface DragDropListProps<T> { items: T[]; onReorder: (items: T[]) => void; renderItem: (item: T, index: number) => React.ReactNode; keyExtractor: (item: T) => string; className?: string; }

export function DragDropList<T>({ items, onReorder, renderItem, keyExtractor, className }: DragDropListProps<T>) {
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const handleDragStart = (i: number) => setDragIndex(i);
  const handleDragOver = (e: React.DragEvent, i: number) => { e.preventDefault(); if (dragIndex !== null && dragIndex !== i) { const newItems = [...items]; const [removed] = newItems.splice(dragIndex, 1); newItems.splice(i, 0, removed); onReorder(newItems); setDragIndex(i); } };
  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, i) => <div key={keyExtractor(item)} draggable onDragStart={() => handleDragStart(i)} onDragOver={(e) => handleDragOver(e, i)} onDragEnd={() => setDragIndex(null)} className="cursor-move">{renderItem(item, i)}</div>)}
    </div>
  );
}
export default DragDropList;
