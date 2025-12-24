import { memo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
interface HelpTooltipProps { content: string; }
export const HelpTooltip = memo(function HelpTooltip({ content }: HelpTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></TooltipTrigger>
        <TooltipContent><p className="max-w-xs">{content}</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
