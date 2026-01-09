import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface DeadlineCountdownProps { targetDate: Date; title?: string; onComplete?: () => void; className?: string; }

export function DeadlineCountdown({ targetDate, title, onComplete, className }: DeadlineCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      if (distance < 0) { clearInterval(timer); onComplete?.(); return; }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  return (
    <Card className={className}>
      <CardContent className="p-4 text-center">
        {title && <p className="text-sm text-muted-foreground mb-2">{title}</p>}
        <div className="flex justify-center gap-4">
          {Object.entries(timeLeft).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-3xl font-bold">{String(value).padStart(2, "0")}</div>
              <div className="text-xs text-muted-foreground">{key}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
export default DeadlineCountdown;
