import { memo } from "react";
import { TooltipContent as TC } from "@/components/ui/tooltip";
interface TooltipContentProps { children: React.ReactNode; side?: "top" | "right" | "bottom" | "left"; }
export const TooltipContent = memo(function TooltipContent({ children, side = "top" }: TooltipContentProps) {
  return <TC side={side}>{children}</TC>;
});
