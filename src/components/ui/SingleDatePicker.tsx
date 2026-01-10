import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SingleDatePickerProps { value?: Date; onChange: (date?: Date) => void; placeholder?: string; className?: string; }

export function SingleDatePicker({ value, onChange, placeholder = "Selecione", className }: SingleDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("justify-start", !value && "text-muted-foreground", className)}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "dd/MM/yyyy", { locale: ptBR }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={value} onSelect={onChange} locale={ptBR} /></PopoverContent>
    </Popover>
  );
}
export default SingleDatePicker;
