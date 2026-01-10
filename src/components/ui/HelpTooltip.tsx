import React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface HelpTooltipProps { content: string; side?: "top" | "right" | "bottom" | "left"; className?: string; }

export function HelpTooltip({ content, side = "top", className }: HelpTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild><HelpCircle className={cn("h-4 w-4 text-muted-foreground cursor-help", className)} /></TooltipTrigger>
        <TooltipContent side={side}><p className="max-w-xs text-sm">{content}</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
export default HelpTooltip;
