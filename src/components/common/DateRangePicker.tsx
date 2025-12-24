/**
 * @fileoverview Seletor de período
 * @module components/common/DateRangePicker
 */
import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

interface DateRangePickerProps { value?: DateRange; onChange: (range: DateRange | undefined) => void; placeholder?: string; }

export const DateRangePicker = memo(function DateRangePicker({ value, onChange, placeholder = 'Selecione o período' }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const fmt = (d: Date) => d.toLocaleDateString('pt-BR');
  const label = value?.from ? (value.to ? `${fmt(value.from)} - ${fmt(value.to)}` : fmt(value.from)) : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('w-full justify-start text-left', !value?.from && 'text-muted-foreground')}>
          <CalendarIcon className="mr-2 h-4 w-4" />{label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="range" selected={value} onSelect={onChange} numberOfMonths={2} />
      </PopoverContent>
    </Popover>
  );
});
