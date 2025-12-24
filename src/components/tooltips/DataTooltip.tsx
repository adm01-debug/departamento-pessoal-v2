import { memo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
interface DataTooltipProps { children: React.ReactNode; data: { label: string; value: string }[]; }
export const DataTooltip = memo(function DataTooltip({ children, data }: DataTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="space-y-1">{data.map((d,i) => <div key={i} className="flex justify-between gap-4"><span className="text-muted-foreground">{d.label}:</span><span className="font-medium">{d.value}</span></div>)}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
