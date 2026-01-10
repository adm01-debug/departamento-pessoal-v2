import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DateRangeProps { from?: Date; to?: Date; onChange: (range: { from?: Date; to?: Date }) => void; className?: string; }

export function DateRangeSelect({ from, to, onChange, className }: DateRangeProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("justify-start text-left", className)}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {from ? (to ? `${format(from, "dd/MM/yy")} - ${format(to, "dd/MM/yy")}` : format(from, "dd/MM/yy")) : "Período"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0"><Calendar mode="range" selected={{ from, to }} onSelect={(r) => onChange({ from: r?.from, to: r?.to })} numberOfMonths={2} locale={ptBR} /></PopoverContent>
    </Popover>
  );
}
export default DateRangeSelect;
