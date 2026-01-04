import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarEvent { id: string; title: string; start: Date; end?: Date; color?: string; location?: string; type?: string; }
interface EventListProps { events: CalendarEvent[]; title?: string; maxHeight?: number; onEventClick?: (event: CalendarEvent) => void; className?: string; groupByDate?: boolean; }

export function EventList({ events, title = "Eventos", maxHeight = 400, onEventClick, className, groupByDate = true }: EventListProps) {
  const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
  const getDateLabel = (date: Date) => { if (isToday(date)) return "Hoje"; if (isTomorrow(date)) return "Amanhã"; return format(date, "EEEE, dd MMM", { locale: ptBR }); };
  const grouped = groupByDate ? sorted.reduce((acc, event) => { const key = format(event.start, "yyyy-MM-dd"); if (!acc[key]) acc[key] = []; acc[key].push(event); return acc; }, {} as Record<string, CalendarEvent[]>) : { all: sorted };

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4" />{title}<Badge variant="secondary">{events.length}</Badge></CardTitle></CardHeader>
      <CardContent>
        {events.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">Nenhum evento</p> : (
          <ScrollArea style={{ maxHeight }}>
            <div className="space-y-4">
              {Object.entries(grouped).map(([date, dayEvents]) => (
                <div key={date}>
                  {groupByDate && <p className="text-xs font-medium text-muted-foreground mb-2">{getDateLabel(new Date(date))}</p>}
                  <div className="space-y-2">
                    {dayEvents.map(event => (
                      <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer group" onClick={() => onEventClick?.(event)}>
                        <div className="w-1 h-10 rounded-full" style={{ backgroundColor: event.color || "#3b82f6" }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{event.title}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(event.start, "HH:mm")}{event.end && ` - ${format(event.end, "HH:mm")}`}</span>
                            {event.location && <span className="flex items-center gap-1 truncate"><MapPin className="h-3 w-3" />{event.location}</span>}
                          </div>
                        </div>
                        {event.type && <Badge variant="outline" className="text-xs">{event.type}</Badge>}
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
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
