/**
 * @fileoverview Painel de filtros
 * @module components/filter/FilterPanel
 */
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface FilterPanelProps { children: React.ReactNode; onClear?: () => void; activeCount?: number; }

export const FilterPanel = memo(function FilterPanel({ children, onClear, activeCount = 0 }: FilterPanelProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between py-3">
        <CardTitle className="text-base flex items-center gap-2"><Filter className="h-4 w-4" />Filtros{activeCount > 0 && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">{activeCount}</span>}</CardTitle>
        {onClear && activeCount > 0 && <Button variant="ghost" size="sm" onClick={onClear}><X className="h-4 w-4 mr-1" />Limpar</Button>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
});
