import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RelativeTimeProps {
  date: Date | string;
  showTooltip?: boolean;
  updateInterval?: number;
  className?: string;
}

export function RelativeTime({ date, showTooltip = true, updateInterval = 60000, className }: RelativeTimeProps) {
  const [, setTick] = useState(0);
  const dateObj = typeof date === "string" ? new Date(date) : date;

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval]);

  const relative = formatDistanceToNow(dateObj, { addSuffix: true, locale: ptBR });
  const absolute = format(dateObj, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

  const content = <span className={cn("text-muted-foreground", className)}>{relative}</span>;

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent>{absolute}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}
export default RelativeTime;
