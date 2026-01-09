import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PeriodSelectProps { label?: string; startDate?: Date; endDate?: Date; onStartChange: (date: Date | undefined) => void; onEndChange: (date: Date | undefined) => void; disabled?: boolean; className?: string; }

export function PeriodSelect({ label, startDate, endDate, onStartChange, onEndChange, disabled, className }: PeriodSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex-1 justify-start" disabled={disabled}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Data inicial"}
            </Button>
          </PopoverTrigger>
          <PopoverContent><Calendar mode="single" selected={startDate} onSelect={onStartChange} locale={ptBR} /></PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex-1 justify-start" disabled={disabled}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : "Data final"}
            </Button>
          </PopoverTrigger>
          <PopoverContent><Calendar mode="single" selected={endDate} onSelect={onEndChange} locale={ptBR} disabled={(date) => startDate ? date < startDate : false} /></PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
export default PeriodSelect;
