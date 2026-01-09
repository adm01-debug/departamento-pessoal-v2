import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LiveClockProps { showDate?: boolean; showSeconds?: boolean; className?: string; }

export function LiveClock({ showDate = true, showSeconds = true, className }: LiveClockProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeFormat = showSeconds ? "HH:mm:ss" : "HH:mm";

  return (
    <div className={cn("text-center", className)}>
      <p className="text-4xl font-mono font-bold">{format(now, timeFormat)}</p>
      {showDate && <p className="text-sm text-muted-foreground mt-1">{format(now, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>}
    </div>
  );
}
export default LiveClock;
