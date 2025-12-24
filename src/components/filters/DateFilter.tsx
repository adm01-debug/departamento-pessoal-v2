/**
 * @file DateFilter.tsx
 * @description Filtro de intervalo de datas
 * @category Components/Filters
 */

import React, { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';

/**
 * Props do DateFilter
 */
export interface DateFilterProps {
  /** Intervalo selecionado */
  value?: DateRange;
  /** Callback de mudança */
  onChange: (range: DateRange | undefined) => void;
  /** Placeholder */
  placeholder?: string;
  /** Formato de exibição */
  displayFormat?: string;
  /** Se está desabilitado */
  disabled?: boolean;
  /** Classe adicional */
  className?: string;
  /** Se permite limpar */
  clearable?: boolean;
  /** Número de meses a exibir */
  numberOfMonths?: 1 | 2;
}

/**
 * Filtro de intervalo de datas
 * 
 * @example
 * ```tsx
 * <DateFilter
 *   value={dateRange}
 *   onChange={setDateRange}
 *   placeholder="Período"
 *   numberOfMonths={2}
 * />
 * ```
 */
export const DateFilter = memo(function DateFilter({
  value,
  onChange,
  placeholder = 'Selecionar período',
  displayFormat = 'dd/MM/yyyy',
  disabled = false,
  className,
  clearable = true,
  numberOfMonths = 2,
}: DateFilterProps) {
  const [open, setOpen] = useState(false);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  const formatRange = () => {
    if (!value?.from) return placeholder;
    if (!value.to) return format(value.from, displayFormat, { locale: ptBR });
    return `${format(value.from, displayFormat, { locale: ptBR })} - ${format(value.to, displayFormat, { locale: ptBR })}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="truncate">{formatRange()}</span>
          {clearable && value?.from && (
            <X
              className="ml-auto h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          numberOfMonths={numberOfMonths}
          locale={ptBR}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
});

DateFilter.displayName = 'DateFilter';

export default DateFilter;
