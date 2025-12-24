/**
 * @fileoverview Barra de filtros
 * @module components/common/FilterBar
 */
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

interface FilterBarProps { children: React.ReactNode; activeFilters?: number; onClear?: () => void; }

export const FilterBar = memo(function FilterBar({ children, activeFilters = 0, onClear }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Filter className="h-4 w-4" />Filtros
        {activeFilters > 0 && <Badge variant="secondary">{activeFilters}</Badge>}
      </div>
      <div className="flex flex-wrap items-center gap-4 flex-1">{children}</div>
      {activeFilters > 0 && onClear && (
        <Button variant="ghost" size="sm" onClick={onClear}><X className="h-4 w-4 mr-1" />Limpar</Button>
      )}
    </div>
  );
});
