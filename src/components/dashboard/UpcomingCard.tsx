import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CalendarDays, Clock, MapPin, ChevronRight } from "lucide-react";
import { format, isToday, isTomorrow, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UpcomingEvent { id: string; title: string; date: Date; time?: string; location?: string; type?: string; }
interface UpcomingCardProps { events: UpcomingEvent[]; title?: string; maxItems?: number; maxHeight?: number; onEventClick?: (id: string) => void; onViewAll?: () => void; className?: string; }

export function UpcomingCard({ events, title = "Próximos Eventos", maxItems = 5, maxHeight = 300, onEventClick, onViewAll, className }: UpcomingCardProps) {
  const sorted = [...events].sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, maxItems);
  const getDateLabel = (date: Date) => { if (isToday(date)) return "Hoje"; if (isTomorrow(date)) return "Amanhã"; const days = differenceInDays(date, new Date()); if (days < 7) return `Em ${days} dias`; return format(date, "dd/MM", { locale: ptBR }); };

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2"><CalendarDays className="h-4 w-4" />{title}</CardTitle>
        {onViewAll && <Button variant="ghost" size="sm" onClick={onViewAll}>Ver agenda<ChevronRight className="h-4 w-4 ml-1" /></Button>}
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">Nenhum evento próximo</p> : (
          <ScrollArea style={{ maxHeight }}>
            <div className="space-y-3">
              {sorted.map(event => (
                <div key={event.id} className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => onEventClick?.(event.id)}>
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                    <span className="text-lg font-bold">{format(event.date, "dd")}</span>
                    <span className="text-xs uppercase">{format(event.date, "MMM", { locale: ptBR })}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{event.time || getDateLabel(event.date)}</span>
                      {event.location && <span className="flex items-center gap-1 truncate"><MapPin className="h-3 w-3" />{event.location}</span>}
                    </div>
                  </div>
                  {event.type && <Badge variant="outline" className="self-start">{event.type}</Badge>}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
export default UpcomingCard;
