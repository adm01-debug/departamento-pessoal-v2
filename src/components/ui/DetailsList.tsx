import React from "react";
import { cn } from "@/lib/utils";

interface DetailsItem {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
}

interface DetailsListProps {
  items: DetailsItem[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export function DetailsList({ items, columns = 2, className, labelClassName, valueClassName }: DetailsListProps) {
  const gridCols = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" };

  return (
    <dl className={cn("grid gap-4", gridCols[columns], className)}>
      {items.map((item, i) => (
        <div key={i} className={cn(item.fullWidth && "col-span-full")}>
          <dt className={cn("text-sm text-muted-foreground", labelClassName)}>{item.label}</dt>
          <dd className={cn("text-sm font-medium mt-0.5", valueClassName)}>{item.value ?? "-"}</dd>
        </div>
      ))}
    </dl>
  );
}
export default DetailsList;
