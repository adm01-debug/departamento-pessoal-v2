import { memo } from "react";
import { TooltipTrigger as TT } from "@/components/ui/tooltip";
interface TooltipTriggerProps { children: React.ReactNode; asChild?: boolean; }
export const TooltipTrigger = memo(function TooltipTrigger({ children, asChild = true }: TooltipTriggerProps) {
  return <TT asChild={asChild}>{children}</TT>;
});
