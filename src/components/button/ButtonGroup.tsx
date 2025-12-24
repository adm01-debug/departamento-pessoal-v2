import { memo } from "react";
import { cn } from "@/lib/utils";
interface ButtonGroupProps { children: React.ReactNode; className?: string; }
export const ButtonGroup = memo(function ButtonGroup({ children, className }: ButtonGroupProps) {
  return <div className={cn("flex gap-2", className)}>{children}</div>;
});
