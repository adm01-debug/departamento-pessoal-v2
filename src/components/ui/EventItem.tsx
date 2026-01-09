import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";

interface EventItemProps { title: string; date: string; time?: string; location?: string; type?: string; color?: string; onClick?: () => void; className?: string; }

export function EventItem({ title, date, time, location, type, color = "#3b82f6", onClick, className }: EventItemProps) {
  return (
    <div className={cn("flex gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors", className)} onClick={onClick}>
      <div className="w-1 rounded-full" style={{ backgroundColor: color }} />
      <div className="flex-1">
        <div className="flex items-center justify-between"><p className="font-medium">{title}</p>{type && <Badge variant="secondary">{type}</Badge>}</div>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{date}</span>
          {time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{time}</span>}
          {location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{location}</span>}
        </div>
      </div>
    </div>
  );
}
export default EventItem;
