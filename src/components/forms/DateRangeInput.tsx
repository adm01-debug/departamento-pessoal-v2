import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
interface DateRangeInputProps { startDate?: string; endDate?: string; onStartChange?: (date: string) => void; onEndChange?: (date: string) => void; className?: string; }
export function DateRangeInput({ startDate, endDate, onStartChange, onEndChange, className }: DateRangeInputProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}><Input type="date" value={startDate || ""} onChange={e => onStartChange?.(e.target.value)} className="flex-1" placeholder="Data início" /><span className="text-muted-foreground">até</span><Input type="date" value={endDate || ""} onChange={e => onEndChange?.(e.target.value)} className="flex-1" placeholder="Data fim" /></div>
  );
}
export default DateRangeInput;
