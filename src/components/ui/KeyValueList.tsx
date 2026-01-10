import React from "react";
import { cn } from "@/lib/utils";

interface KeyValueListProps { items: { key: string; value: React.ReactNode }[]; className?: string; }

export function KeyValueList({ items, className }: KeyValueListProps) {
  return (
    <dl className={cn("space-y-2", className)}>
      {items.map((item, i) => (
        <div key={i} className="flex justify-between py-2 border-b last:border-0">
          <dt className="text-muted-foreground">{item.key}</dt>
          <dd className="font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
export default KeyValueList;
