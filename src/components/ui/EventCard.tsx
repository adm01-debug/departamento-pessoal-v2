import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface EventCardProps { title: string; date: string; time?: string; location?: string; status?: string; className?: string; }

export function EventCard({ title, date, time, location, status, className }: EventCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          {status && <Badge variant="secondary">{status}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2"><Calendar className="h-4 w-4" />{date}</div>
        {time && <div className="flex items-center gap-2"><Clock className="h-4 w-4" />{time}</div>}
        {location && <p>{location}</p>}
      </CardContent>
    </Card>
  );
}
export default EventCard;
