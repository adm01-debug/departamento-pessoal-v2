import { memo, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Calendar } from '@/components/ui/calendar';
import { SlidersHorizontal, X, CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'between';

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'dateRange';
  options?: { value: string; label: string }[];
  operators?: FilterOperator[];
}

export interface FilterValue {
  key: string;
  operator: FilterOperator;
  value: unknown;
  value2?: unknown; // Para operador 'between'
}

interface AdvancedFiltersProps {
  /** Configuração dos filtros disponíveis */
  filters: FilterConfig[];
  /** Valores atuais dos filtros */
  values: FilterValue[];
  /** Callback quando filtros mudam */
  onChange: (values: FilterValue[]) => void;
  /** Classes adicionais */
  className?: string;
  /** Modo inline ou sheet */
  mode?: 'inline' | 'sheet';
}

const operatorLabels: Record<FilterOperator, string> = {
  eq: 'igual a',
  neq: 'diferente de',
  gt: 'maior que',
  gte: 'maior ou igual a',
  lt: 'menor que',
  lte: 'menor ou igual a',
  like: 'contém',
  in: 'está em',
  between: 'entre',
};

const defaultOperators: Record<string, FilterOperator[]> = {
  text: ['like', 'eq', 'neq'],
  number: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between'],
  date: ['eq', 'gt', 'gte', 'lt', 'lte', 'between'],
  dateRange: ['between'],
  select: ['eq', 'neq', 'in'],
  boolean: ['eq'],
};

export const AdvancedFilters = memo(function AdvancedFilters({
  filters,
  values,
  onChange,
  className,
  mode = 'sheet',
}: AdvancedFiltersProps) {
  const [localValues, setLocalValues] = useState<FilterValue[]>(values);
  const [open, setOpen] = useState(false);

  const handleAddFilter = useCallback(() => {
    const firstAvailable = filters.find(
      (f) => !localValues.some((v) => v.key === f.key)
    );
    if (firstAvailable) {
      const defaultOp = (firstAvailable.operators || defaultOperators[firstAvailable.type])[0];
      setLocalValues((prev) => [
        ...prev,
        { key: firstAvailable.key, operator: defaultOp, value: '' },
      ]);
    }
  }, [filters, localValues]);

  const handleRemoveFilter = useCallback((index: number) => {
    setLocalValues((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleFilterChange = useCallback(
    (index: number, updates: Partial<FilterValue>) => {
      setLocalValues((prev) =>
        prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
      );
    },
    []
  );

  const handleApply = useCallback(() => {
    onChange(localValues.filter((v) => v.value !== '' && v.value !== undefined));
    setOpen(false);
  }, [localValues, onChange]);

  const handleClear = useCallback(() => {
    setLocalValues([]);
    onChange([]);
    setOpen(false);
  }, [onChange]);

  const activeCount = values.filter((v) => v.value !== '' && v.value !== undefined).length;

  const renderFilterInput = (filter: FilterConfig, value: FilterValue, index: number) => {
    const operators = filter.operators || defaultOperators[filter.type];

    return (
      <div key={index} className="flex items-end gap-2 p-3 bg-muted/50 rounded-lg">
        {/* Campo */}
        <div className="flex-1 space-y-1">
          <Label className="text-xs">{filter.label}</Label>
          <Select
            value={value.key}
            onValueChange={(key) => {
              const newFilter = filters.find((f) => f.key === key);
              if (newFilter) {
                handleFilterChange(index, {
                  key,
                  operator: (newFilter.operators || defaultOperators[newFilter.type])[0],
                  value: '',
                });
              }
            }}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filters.map((f) => (
                <SelectItem key={f.key} value={f.key}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Operador */}
        <div className="w-32 space-y-1">
          <Label className="text-xs">Operador</Label>
          <Select
            value={value.operator}
            onValueChange={(op) =>
              handleFilterChange(index, { operator: op as FilterOperator })
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {operators.map((op) => (
                <SelectItem key={op} value={op}>
                  {operatorLabels[op]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Valor */}
        <div className="flex-1 space-y-1">
          <Label className="text-xs">Valor</Label>
          {filter.type === 'select' && filter.options ? (
            <Select
              value={String(value.value)}
              onValueChange={(v) => handleFilterChange(index, { value: v })}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : filter.type === 'date' || filter.type === 'dateRange' ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-9 w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value.value
                    ? format(new Date(value.value as string), 'dd/MM/yyyy', { locale: ptBR })
                    : 'Selecionar data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value.value ? new Date(value.value as string) : undefined}
                  onSelect={(date) =>
                    handleFilterChange(index, { value: date?.toISOString() })
                  }
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          ) : filter.type === 'boolean' ? (
            <Select
              value={String(value.value)}
              onValueChange={(v) => handleFilterChange(index, { value: v === 'true' })}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sim</SelectItem>
                <SelectItem value="false">Não</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              type={filter.type === 'number' ? 'number' : 'text'}
              value={String(value.value ?? '')}
              onChange={(e) =>
                handleFilterChange(index, {
                  value: filter.type === 'number' ? Number(e.target.value) : e.target.value,
                })
              }
              className="h-9"
            />
          )}
        </div>

        {/* Remover */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-destructive"
          onClick={() => handleRemoveFilter(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const FiltersContent = (
    <div className="space-y-4">
      {localValues.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum filtro adicionado
        </div>
      ) : (
        <div className="space-y-2">
          {localValues.map((value, index) => {
            const filter = filters.find((f) => f.key === value.key);
            if (!filter) return null;
            return renderFilterInput(filter, value, index);
          })}
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={handleAddFilter}
        disabled={localValues.length >= filters.length}
        className="w-full gap-2"
      >
        <Plus className="h-4 w-4" />
        Adicionar Filtro
      </Button>
    </div>
  );

  if (mode === 'sheet') {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className={cn('gap-2', className)}>
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {activeCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                {activeCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Filtros Avançados</SheetTitle>
            <SheetDescription>
              Configure filtros para refinar sua busca
            </SheetDescription>
          </SheetHeader>

          <div className="py-6">{FiltersContent}</div>

          <SheetFooter>
            <Button variant="outline" onClick={handleClear}>
              Limpar Todos
            </Button>
            <Button onClick={handleApply}>Aplicar Filtros</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {FiltersContent}
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleClear}>
          Limpar
        </Button>
        <Button onClick={handleApply}>Aplicar</Button>
      </div>
    </div>
  );
});

/**
 * Componente para exibir filtros ativos como badges
 */
export const ActiveFiltersBadges = memo(function ActiveFiltersBadges({
  filters,
  values,
  onRemove,
  onClearAll,
}: {
  filters: FilterConfig[];
  values: FilterValue[];
  onRemove: (key: string) => void;
  onClearAll: () => void;
}) {
  const activeFilters = values.filter((v) => v.value !== '' && v.value !== undefined);

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeFilters.map((value) => {
        const filter = filters.find((f) => f.key === value.key);
        if (!filter) return null;

        let displayValue = String(value.value);
        if (filter.type === 'date' && value.value) {
          displayValue = format(new Date(value.value as string), 'dd/MM/yyyy', { locale: ptBR });
        } else if (filter.type === 'select' && filter.options) {
          displayValue = filter.options.find((o) => o.value === value.value)?.label || displayValue;
        } else if (filter.type === 'boolean') {
          displayValue = value.value ? 'Sim' : 'Não';
        }

        return (
          <Badge
            key={value.key}
            variant="secondary"
            className="gap-1 pr-1"
          >
            <span>{filter.label}:</span>
            <span className="font-normal">{operatorLabels[value.operator]}</span>
            <span className="font-semibold">{displayValue}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => onRemove(value.key)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        );
      })}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-6 text-xs text-muted-foreground"
      >
        Limpar todos
      </Button>
    </div>
  );
});

export default AdvancedFilters;
