/**
 * @fileoverview Seletor de data
 * @module components/common/DatePicker
 */
import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerProps { value?: Date; onChange: (date: Date | undefined) => void; placeholder?: string; disabled?: boolean; }

export const DatePicker = memo(function DatePicker({ value, onChange, placeholder = 'Selecione', disabled }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const formatDate = (d: Date) => d.toLocaleDateString('pt-BR');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={disabled} className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? formatDate(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={value} onSelect={(d) => { onChange(d); setOpen(false); }} /></PopoverContent>
    </Popover>
  );
});
