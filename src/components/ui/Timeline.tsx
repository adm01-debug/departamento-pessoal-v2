import React from "react";
import { cn } from "@/lib/utils";
import { Check, Circle, Clock, AlertCircle } from "lucide-react";

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  status?: "completed" | "current" | "pending" | "error";
  icon?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
  orientation?: "vertical" | "horizontal";
  alternating?: boolean;
  onItemClick?: (item: TimelineItem) => void;
}

export function Timeline({ items, className, orientation = "vertical", alternating = false, onItemClick }: TimelineProps) {
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "completed": return <Check className="h-4 w-4" />;
      case "current": return <Clock className="h-4 w-4" />;
      case "error": return <AlertCircle className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed": return "bg-green-500 text-white";
      case "current": return "bg-blue-500 text-white";
      case "error": return "bg-red-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (orientation === "horizontal") {
    return (
      <div className={cn("flex items-start overflow-x-auto pb-4", className)}>
        {items.map((item, index) => (
          <div key={item.id} className="flex flex-col items-center min-w-[150px] cursor-pointer" onClick={() => onItemClick?.(item)}>
            <div className="flex items-center w-full">
              {index > 0 && <div className={cn("flex-1 h-0.5", item.status === "completed" || items[index - 1].status === "completed" ? "bg-green-500" : "bg-border")} />}
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", getStatusColor(item.status))}>{item.icon || getStatusIcon(item.status)}</div>
              {index < items.length - 1 && <div className={cn("flex-1 h-0.5", item.status === "completed" ? "bg-green-500" : "bg-border")} />}
            </div>
            <div className="mt-2 text-center px-2">
              <p className="text-sm font-medium">{item.title}</p>
              {item.date && <p className="text-xs text-muted-foreground">{item.date}</p>}
              {item.description && <p className="text-xs text-muted-foreground mt-1">{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
      {items.map((item, index) => (
        <div key={item.id} className={cn("relative pl-10 pb-6 last:pb-0 cursor-pointer", alternating && index % 2 === 1 && "ml-auto pr-10 pl-0 text-right")} onClick={() => onItemClick?.(item)}>
          <div className={cn("absolute w-8 h-8 rounded-full flex items-center justify-center", getStatusColor(item.status), alternating && index % 2 === 1 ? "right-0" : "left-0")}>{item.icon || getStatusIcon(item.status)}</div>
          <div className="bg-card border rounded-lg p-3">
            <div className="flex items-center justify-between">
              <p className="font-medium">{item.title}</p>
              {item.date && <span className="text-xs text-muted-foreground">{item.date}</span>}
            </div>
            {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
export default Timeline;
