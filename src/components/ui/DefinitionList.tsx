import React from "react";
import { cn } from "@/lib/utils";

interface DefinitionListProps { items: { term: string; definition: string }[]; layout?: "vertical" | "horizontal"; className?: string; }

export function DefinitionList({ items, layout = "vertical", className }: DefinitionListProps) {
  return (
    <dl className={cn(layout === "horizontal" ? "grid grid-cols-2 gap-4" : "space-y-4", className)}>
      {items.map((item, i) => (
        <div key={i}>
          <dt className="text-sm font-medium text-muted-foreground">{item.term}</dt>
          <dd className="mt-1">{item.definition}</dd>
        </div>
      ))}
    </dl>
  );
}
export default DefinitionList;
