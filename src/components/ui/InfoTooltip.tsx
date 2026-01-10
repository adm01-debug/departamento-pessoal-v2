import React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface InfoTooltipProps { content: React.ReactNode; side?: "top" | "right" | "bottom" | "left"; className?: string; }

export function InfoTooltip({ content, side = "top", className }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild><Info className={cn("h-4 w-4 text-muted-foreground cursor-help", className)} /></TooltipTrigger>
        <TooltipContent side={side}><div className="max-w-xs text-sm">{content}</div></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
export default InfoTooltip;
