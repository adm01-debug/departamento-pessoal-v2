import { memo } from "react";
import { cn } from "@/lib/utils";
interface ColumnProps { children: React.ReactNode; span?: number; className?: string; }
export const Column = memo(function Column({ children, span = 1, className }: ColumnProps) {
  return <div className={cn(className)} style={{ gridColumn: `span ${span}` }}>{children}</div>;
});
