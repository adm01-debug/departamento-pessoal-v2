import React from "react";
import { cn } from "@/lib/utils";

interface TimelineEvent { title: string; description?: string; date: string; icon?: React.ReactNode; }
interface TimelineViewProps { events: TimelineEvent[]; className?: string; }

export function TimelineView({ events, className }: TimelineViewProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {events.map((event, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">{event.icon || <span className="h-2 w-2 rounded-full bg-primary" />}</div>
            {i < events.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
          </div>
          <div className="pb-4">
            <p className="font-medium">{event.title}</p>
            {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}
            <p className="text-xs text-muted-foreground mt-1">{event.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
export default TimelineView;
