import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface MonthPickerProps { value?: { month: number; year: number }; onChange: (value: { month: number; year: number }) => void; className?: string; }

const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function MonthPicker({ value, onChange, className }: MonthPickerProps) {
  const current = value || { month: new Date().getMonth(), year: new Date().getFullYear() };
  const [year, setYear] = React.useState(current.year);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-full justify-start", className)}>
          <Calendar className="mr-2 h-4 w-4" />
          {months[current.month]} {current.year}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" size="icon" onClick={() => setYear(year - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="font-medium">{year}</span>
          <Button variant="ghost" size="icon" onClick={() => setYear(year + 1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {months.map((m, i) => (
            <Button key={m} variant={current.month === i && current.year === year ? "default" : "ghost"} size="sm" onClick={() => onChange({ month: i, year })}>{m}</Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
export default MonthPicker;
