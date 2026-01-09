import React from "react";
import { cn } from "@/lib/utils";

type StatusType = "success" | "warning" | "error" | "info" | "pending";
interface StatusDotProps { status: StatusType; label?: string; pulse?: boolean; size?: "sm" | "md" | "lg"; className?: string; }

const statusColors: Record<StatusType, string> = { success: "bg-green-500", warning: "bg-yellow-500", error: "bg-red-500", info: "bg-blue-500", pending: "bg-gray-400" };
const sizeClasses = { sm: "h-2 w-2", md: "h-3 w-3", lg: "h-4 w-4" };

export function StatusDot({ status, label, pulse = false, size = "md", className }: StatusDotProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("rounded-full", statusColors[status], sizeClasses[size], pulse && "animate-pulse")} />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
export default StatusDot;
