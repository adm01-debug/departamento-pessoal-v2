/**
 * @fileoverview Filtros para logs de auditoria
 * @module components/auditoria/AuditFilter
 */
import { memo, useState } from 'react';
import { Search, Filter, Calendar, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';

interface AuditFilterProps {
  onFilterChange: (filters: AuditFilters) => void;
}

interface AuditFilters {
  search?: string;
  action?: string;
  userId?: string;
  dateRange?: DateRange;
}

const actions = [
  { value: 'create', label: 'Criação' },
  { value: 'update', label: 'Atualização' },
  { value: 'delete', label: 'Exclusão' },
  { value: 'login', label: 'Login' },
  { value: 'export', label: 'Exportação' },
];

/**
 * Filtros avançados para auditoria
 */
export const AuditFilter = memo(function AuditFilter({ onFilterChange }: AuditFilterProps) {
  const [filters, setFilters] = useState<AuditFilters>({});
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const updateFilter = (key: keyof AuditFilters, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar..." className="pl-10" onChange={(e) => updateFilter('search', e.target.value)} />
      </div>
      <Select onValueChange={(v) => updateFilter('action', v)}>
        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Ação" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todas</SelectItem>
          {actions.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? `${format(dateRange.from, 'dd/MM', { locale: ptBR })} - ${format(dateRange.to, 'dd/MM', { locale: ptBR })}` : format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })
            ) : 'Período'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <CalendarComponent mode="range" selected={dateRange} onSelect={(r) => { setDateRange(r); updateFilter('dateRange', r); }} numberOfMonths={2} />
        </PopoverContent>
      </Popover>
    </div>
  );
});
