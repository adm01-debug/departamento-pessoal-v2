import React from "react";
import { cn } from "@/lib/utils";

interface VirtualizedListProps<T> { items: T[]; height: number; itemHeight: number; renderItem: (item: T, index: number) => React.ReactNode; className?: string; }

export function VirtualizedList<T>({ items, height, itemHeight, renderItem, className }: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = React.useState(0);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + Math.ceil(height / itemHeight) + 1, items.length);
  const visibleItems = items.slice(startIndex, endIndex);
  return (
    <div className={cn("overflow-auto", className)} style={{ height }} onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}>
      <div style={{ height: items.length * itemHeight, position: "relative" }}>
        {visibleItems.map((item, i) => <div key={startIndex + i} style={{ position: "absolute", top: (startIndex + i) * itemHeight, height: itemHeight, width: "100%" }}>{renderItem(item, startIndex + i)}</div>)}
      </div>
    </div>
  );
}
export default VirtualizedList;
