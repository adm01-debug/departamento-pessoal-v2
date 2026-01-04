import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CalendarioPontoProps { className?: string; events?: Array<{ date: Date; title: string; type: string }>; onDateSelect?: (date: Date) => void; }

export function CalendarioPonto({ className, events = [], onDateSelect }: CalendarioPontoProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const handleSelect = (date: Date | undefined) => { setSelectedDate(date); if (date && onDateSelect) onDateSelect(date); };
  const eventsForDate = (date: Date) => events.filter(e => e.date.toDateString() === date.toDateString());

  return (
    <Card className={cn("", className)}>
      <CardHeader><CardTitle>CalendarioPonto</CardTitle></CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4">
        <Calendar mode="single" selected={selectedDate} onSelect={handleSelect} className="rounded-md border" />
        <div className="flex-1 space-y-2">
          <h4 className="font-medium">Eventos do dia</h4>
          {selectedDate && eventsForDate(selectedDate).length > 0 ? (
            eventsForDate(selectedDate).map((event, i) => (<div key={i} className="flex items-center gap-2 p-2 bg-muted rounded"><Badge variant="outline">{event.type}</Badge><span className="text-sm">{event.title}</span></div>))
          ) : (<p className="text-sm text-muted-foreground">Nenhum evento</p>)}
        </div>
      </CardContent>
    </Card>
  );
}
export default CalendarioPonto;
