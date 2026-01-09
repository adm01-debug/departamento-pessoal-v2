import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Minus, AlertTriangle, Flag } from "lucide-react";

type Priority = "critical" | "high" | "medium" | "low" | "none";

interface PriorityBadgeProps {
  priority: Priority;
  showIcon?: boolean;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const priorityConfig: Record<Priority, { label: string; color: string; icon: React.ReactNode }> = {
  critical: { label: "Crítica", color: "bg-red-600 text-white", icon: <AlertTriangle className="h-3 w-3" /> },
  high: { label: "Alta", color: "bg-red-500 text-white", icon: <ArrowUp className="h-3 w-3" /> },
  medium: { label: "Média", color: "bg-yellow-500 text-white", icon: <Minus className="h-3 w-3" /> },
  low: { label: "Baixa", color: "bg-blue-500 text-white", icon: <ArrowDown className="h-3 w-3" /> },
  none: { label: "Nenhuma", color: "bg-gray-400 text-white", icon: <Flag className="h-3 w-3" /> },
};

export function PriorityBadge({ priority, showIcon = true, showLabel = true, size = "md", className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  const sizes = { sm: "text-xs px-1.5 py-0", md: "text-xs px-2 py-0.5", lg: "text-sm px-2.5 py-1" };

  return (
    <Badge className={cn(config.color, sizes[size], "gap-1", className)}>
      {showIcon && config.icon}
      {showLabel && config.label}
    </Badge>
  );
}
export default PriorityBadge;
