import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarEvent { id: string; title: string; start: Date; end?: Date; color?: string; location?: string; type?: string; }
interface EventListProps { events: CalendarEvent[]; title?: string; maxHeight?: number; onEventClick?: (event: CalendarEvent) => void; className?: string; emptyMessage?: string; }

export function EventList({ events, title = "Eventos", maxHeight = 400, onEventClick, className, emptyMessage = "Nenhum evento" }: EventListProps) {
  const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4" />{title}<Badge variant="secondary">{events.length}</Badge></CardTitle></CardHeader>
      <CardContent>
        {sorted.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">{emptyMessage}</p> : (
          <ScrollArea style={{ maxHeight }}>
            <div className="space-y-2">
              {sorted.map(event => (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => onEventClick?.(event)}>
                  <div className="w-1 self-stretch rounded" style={{ backgroundColor: event.color || "#3b82f6" }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium truncate">{event.title}</p>
                      {event.type && <Badge variant="outline" className="text-xs">{event.type}</Badge>}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(event.start, "dd/MM HH:mm", { locale: ptBR })}</span>
                      {event.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
export default EventList;
