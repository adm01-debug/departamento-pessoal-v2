import React from "react";
import { cn } from "@/lib/utils";
import { Check, Clock, X, AlertCircle } from "lucide-react";

interface StatusStep { label: string; date?: string; status: "completed" | "current" | "pending" | "error"; description?: string; }
interface StatusTimelineProps { steps: StatusStep[]; className?: string; }

const statusConfig = { completed: { icon: Check, color: "bg-green-500 text-white" }, current: { icon: Clock, color: "bg-blue-500 text-white" }, pending: { icon: Clock, color: "bg-gray-200 text-gray-400" }, error: { icon: X, color: "bg-red-500 text-white" } };

export function StatusTimeline({ steps, className }: StatusTimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, i) => {
        const config = statusConfig[step.status];
        const Icon = config.icon;
        const isLast = i === steps.length - 1;
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", config.color)}><Icon className="h-4 w-4" /></div>
              {!isLast && <div className={cn("w-0.5 flex-1 mt-2", step.status === "completed" ? "bg-green-500" : "bg-gray-200")} />}
            </div>
            <div className="flex-1 pb-4">
              <p className={cn("font-medium", step.status === "pending" && "text-muted-foreground")}>{step.label}</p>
              {step.date && <p className="text-xs text-muted-foreground">{step.date}</p>}
              {step.description && <p className="text-sm text-muted-foreground mt-1">{step.description}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default StatusTimeline;
