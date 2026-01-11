// V15-180: src/components/ui/data-table-toolbar.tsx
import { Input } from './input';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Search, X, Download, Plus, Filter } from 'lucide-react';

interface DataTableToolbarProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onAdd?: () => void;
  addLabel?: string;
  onExport?: () => void;
  filters?: Array<{
    key: string;
    label: string;
    options: Array<{ value: string; label: string }>;
    value?: string;
    onChange: (value: string) => void;
  }>;
  onClearFilters?: () => void;
}

export function DataTableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  onAdd,
  addLabel = 'Novo',
  onExport,
  filters,
  onClearFilters,
}: DataTableToolbarProps) {
  const hasActiveFilters = filters?.some(f => f.value && f.value !== 'all');

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="flex-1 flex gap-2">
        {onSearchChange && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
            {search && (
              <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0" onClick={() => onSearchChange('')}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        {filters?.map((filter) => (
          <Select key={filter.key} value={filter.value} onValueChange={filter.onChange}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder={filter.label} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {filter.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        {hasActiveFilters && onClearFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}><X className="h-4 w-4 mr-1" />Limpar</Button>
        )}
      </div>
      <div className="flex gap-2">
        {onExport && <Button variant="outline" size="sm" onClick={onExport}><Download className="h-4 w-4 mr-1" />Exportar</Button>}
        {onAdd && <Button size="sm" onClick={onAdd}><Plus className="h-4 w-4 mr-1" />{addLabel}</Button>}
      </div>
    </div>
  );
}
