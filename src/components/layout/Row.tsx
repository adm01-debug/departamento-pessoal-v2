import { memo } from "react";
import { cn } from "@/lib/utils";
interface RowProps { children: React.ReactNode; className?: string; }
export const Row = memo(function Row({ children, className }: RowProps) {
  return <div className={cn("flex gap-4", className)}>{children}</div>;
});
