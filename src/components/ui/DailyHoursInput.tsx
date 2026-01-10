import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface DailyHoursInputProps { value: number; onChange: (value: number) => void; className?: string; }

export function DailyHoursInput({ value, onChange, className }: DailyHoursInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} min={0} max={24} step={0.5} className="pr-16" />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">h/dia</span>
    </div>
  );
}
export default DailyHoursInput;
