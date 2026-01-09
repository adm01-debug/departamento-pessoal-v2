import React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Status = "online" | "offline" | "busy" | "away" | "success" | "error" | "warning" | "pending";

interface StatusIndicatorProps {
  status: Status;
  label?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
}

const statusConfig: Record<Status, { color: string; label: string }> = {
  online: { color: "bg-green-500", label: "Online" },
  offline: { color: "bg-gray-400", label: "Offline" },
  busy: { color: "bg-red-500", label: "Ocupado" },
  away: { color: "bg-yellow-500", label: "Ausente" },
  success: { color: "bg-green-500", label: "Sucesso" },
  error: { color: "bg-red-500", label: "Erro" },
  warning: { color: "bg-yellow-500", label: "Atenção" },
  pending: { color: "bg-blue-500", label: "Pendente" },
};

export function StatusIndicator({ status, label, showLabel = false, size = "md", pulse = false, className }: StatusIndicatorProps) {
  const config = statusConfig[status];
  const sizes = { sm: "h-2 w-2", md: "h-3 w-3", lg: "h-4 w-4" };
  const displayLabel = label || config.label;

  const indicator = (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className={cn("rounded-full", sizes[size], config.color, pulse && "animate-pulse")} />
      {showLabel && <span className="text-sm">{displayLabel}</span>}
    </span>
  );

  if (!showLabel) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{indicator}</TooltipTrigger>
          <TooltipContent>{displayLabel}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return indicator;
}
export default StatusIndicator;
