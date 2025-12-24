/**
 * @file FilterDate.tsx
 * @description Filtro de data com seletor
 * @category Components/Filter
 */

import React, { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

/**
 * Props do FilterDate
 */
export interface FilterDateProps {
  /** Data selecionada */
  value?: Date;
  /** Callback de mudança */
  onChange: (date: Date | undefined) => void;
  /** Placeholder */
  placeholder?: string;
  /** Formato de exibição */
  displayFormat?: string;
  /** Data mínima */
  minDate?: Date;
  /** Data máxima */
  maxDate?: Date;
  /** Se está desabilitado */
  disabled?: boolean;
  /** Classe adicional */
  className?: string;
  /** Se permite limpar */
  clearable?: boolean;
}

/**
 * Filtro de data com seletor
 * 
 * @example
 * ```tsx
 * <FilterDate
 *   value={selectedDate}
 *   onChange={setSelectedDate}
 *   placeholder="Selecione uma data"
 *   clearable
 * />
 * ```
 */
export const FilterDate = memo(function FilterDate({
  value,
  onChange,
  placeholder = 'Selecionar data',
  displayFormat = 'dd/MM/yyyy',
  minDate,
  maxDate,
  disabled = false,
  className,
  clearable = true,
}: FilterDateProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
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
          {value ? format(value, displayFormat, { locale: ptBR }) : placeholder}
          {clearable && value && (
            <X
              className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          disabled={(date) => {
            if (minDate && date < minDate) return true;
            if (maxDate && date > maxDate) return true;
            return false;
          }}
          locale={ptBR}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
});

FilterDate.displayName = 'FilterDate';

export default FilterDate;
