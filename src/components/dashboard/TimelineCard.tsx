import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle, AlertCircle, Info, LucideIcon } from "lucide-react";

interface TimelineEvent { id: string; title: string; description?: string; timestamp: Date; type?: "success" | "warning" | "error" | "info"; icon?: LucideIcon; }
interface TimelineCardProps { events: TimelineEvent[]; title?: string; maxHeight?: number; className?: string; }

const typeConfig = { success: { color: "text-green-600", bg: "bg-green-100", icon: CheckCircle }, warning: { color: "text-yellow-600", bg: "bg-yellow-100", icon: AlertCircle }, error: { color: "text-red-600", bg: "bg-red-100", icon: AlertCircle }, info: { color: "text-blue-600", bg: "bg-blue-100", icon: Info } };

export function TimelineCard({ events, title = "Timeline", maxHeight = 400, className }: TimelineCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" />{title}</CardTitle></CardHeader>
      <CardContent>
        {events.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">Nenhum evento</p> : (
          <ScrollArea style={{ maxHeight }}>
            <div className="relative pl-6 space-y-6">
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-muted" />
              {events.map((event, i) => {
                const config = typeConfig[event.type || "info"];
                const Icon = event.icon || config.icon;
                return (
                  <div key={event.id} className="relative">
                    <div className={cn("absolute -left-4 p-1 rounded-full", config.bg)}><Icon className={cn("h-3 w-3", config.color)} /></div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{event.title}</p>
                        {event.type && <Badge variant="secondary" className={cn("text-xs", config.bg, config.color)}>{event.type}</Badge>}
                      </div>
                      {event.description && <p className="text-xs text-muted-foreground">{event.description}</p>}
                      <p className="text-xs text-muted-foreground">{event.timestamp.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
export default TimelineCard;
