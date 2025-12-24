import { memo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
interface InfoTooltipProps { content: string; }
export const InfoTooltip = memo(function InfoTooltip({ content }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild><Info className="h-4 w-4 text-muted-foreground cursor-help" /></TooltipTrigger>
        <TooltipContent><p className="max-w-xs">{content}</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
