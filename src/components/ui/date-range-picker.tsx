// V15-184: src/components/ui/date-range-picker.tsx
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  className?: string;
}

export function DateRangePicker({ value, onChange, placeholder = 'Selecione o período', className }: DateRangePickerProps) {
  const [date, setDate] = useState<DateRange>(value || { from: undefined, to: undefined });

  const handleSelect = (range: DateRange | undefined) => {
    const newRange = range || { from: undefined, to: undefined };
    setDate(newRange);
    onChange?.(newRange);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('w-[280px] justify-start text-left font-normal', !date.from && 'text-muted-foreground', className)}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date.from ? (
            date.to ? (
              <>{format(date.from, 'dd/MM/yyyy', { locale: ptBR })} - {format(date.to, 'dd/MM/yyyy', { locale: ptBR })}</>
            ) : format(date.from, 'dd/MM/yyyy', { locale: ptBR })
          ) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="range" selected={date} onSelect={handleSelect as any} numberOfMonths={2} locale={ptBR} />
      </PopoverContent>
    </Popover>
  );
}
