import React from "react";
import { cn } from "@/lib/utils";

interface MasonryGridProps { children: React.ReactNode[]; columns?: 2 | 3 | 4; className?: string; }

export function MasonryGrid({ children, columns = 3, className }: MasonryGridProps) {
  const cols = { 2: "columns-2", 3: "columns-3", 4: "columns-4" };
  return (
    <div className={cn(cols[columns], "gap-4", className)}>
      {children.map((child, i) => <div key={i} className="mb-4 break-inside-avoid">{child}</div>)}
    </div>
  );
}
export default MasonryGrid;
