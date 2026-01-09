import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface YearPickerProps { value?: number; onChange: (year: number) => void; min?: number; max?: number; className?: string; }

export function YearPicker({ value, onChange, min = 1900, max = 2100, className }: YearPickerProps) {
  const current = value || new Date().getFullYear();
  const [decade, setDecade] = useState(Math.floor(current / 10) * 10);
  const years = Array.from({ length: 12 }, (_, i) => decade + i - 1);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-full justify-start", className)}>
          <Calendar className="mr-2 h-4 w-4" />
          {current}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" size="icon" onClick={() => setDecade(decade - 10)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="font-medium">{decade} - {decade + 9}</span>
          <Button variant="ghost" size="icon" onClick={() => setDecade(decade + 10)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {years.map((y) => (
            <Button key={y} variant={current === y ? "default" : "ghost"} size="sm" onClick={() => onChange(y)} disabled={y < min || y > max}>{y}</Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
export default YearPicker;
