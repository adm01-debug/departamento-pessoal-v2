import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Briefcase, TrendingUp, Award, UserPlus } from "lucide-react";

interface TimelineEvent { id: string; date: string; type: "admissao" | "promocao" | "aumento" | "transferencia"; title: string; description?: string; }
interface EmploymentTimelineProps { events: TimelineEvent[]; className?: string; }

const icons = { admissao: UserPlus, promocao: TrendingUp, aumento: Award, transferencia: Briefcase };
const colors = { admissao: "text-green-500", promocao: "text-blue-500", aumento: "text-yellow-500", transferencia: "text-purple-500" };

export function EmploymentTimeline({ events, className }: EmploymentTimelineProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
      {events.map((event) => {
        const Icon = icons[event.type];
        return (
          <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
            <div className={cn("h-8 w-8 rounded-full bg-background border-2 flex items-center justify-center z-10", colors[event.type])}><Icon className="h-4 w-4" /></div>
            <div className="flex-1 pt-0.5">
              <p className="text-xs text-muted-foreground">{event.date}</p>
              <p className="font-medium">{event.title}</p>
              {event.description && <p className="text-sm text-muted-foreground mt-1">{event.description}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default EmploymentTimeline;
