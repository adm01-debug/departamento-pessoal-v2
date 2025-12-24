import { memo } from "react";
import { TooltipProvider as TP, Tooltip } from "@/components/ui/tooltip";
interface TooltipProviderProps { children: React.ReactNode; }
export const TooltipProvider = memo(function TooltipProvider({ children }: TooltipProviderProps) {
  return <TP><Tooltip>{children}</Tooltip></TP>;
});
