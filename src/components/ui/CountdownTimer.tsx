import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  className?: string;
  variant?: "default" | "compact" | "large";
}

export function CountdownTimer({ targetDate, onComplete, showDays = true, showHours = true, showMinutes = true, showSeconds = true, className, variant = "default" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) { onComplete?.(); return { days: 0, hours: 0, minutes: 0, seconds: 0 }; }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculate());
    const interval = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => {
    if (variant === "compact") return <span>{String(value).padStart(2, "0")}</span>;
    return (
      <div className="flex flex-col items-center">
        <span className={cn("font-bold tabular-nums", variant === "large" ? "text-4xl" : "text-2xl")}>{String(value).padStart(2, "0")}</span>
        <span className="text-xs text-muted-foreground uppercase">{label}</span>
      </div>
    );
  };

  if (variant === "compact") {
    return (
      <span className={cn("font-mono", className)}>
        {showDays && <><TimeUnit value={timeLeft.days} label="d" />:</>}
        {showHours && <><TimeUnit value={timeLeft.hours} label="h" />:</>}
        {showMinutes && <><TimeUnit value={timeLeft.minutes} label="m" />:</>}
        {showSeconds && <TimeUnit value={timeLeft.seconds} label="s" />}
      </span>
    );
  }

  return (
    <div className={cn("flex gap-4", className)}>
      {showDays && <TimeUnit value={timeLeft.days} label="Dias" />}
      {showHours && <TimeUnit value={timeLeft.hours} label="Horas" />}
      {showMinutes && <TimeUnit value={timeLeft.minutes} label="Min" />}
      {showSeconds && <TimeUnit value={timeLeft.seconds} label="Seg" />}
    </div>
  );
}
export default CountdownTimer;
