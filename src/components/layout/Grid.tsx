import { memo } from "react";
import { cn } from "@/lib/utils";
interface GridProps { children: React.ReactNode; cols?: number; gap?: number; className?: string; }
export const Grid = memo(function Grid({ children, cols = 12, gap = 4, className }: GridProps) {
  return <div className={cn("grid", className)} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: `${gap * 0.25}rem` }}>{children}</div>;
});
