/**
 * @fileoverview Chip de filtro
 * @module components/filter/FilterChip
 */
import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface FilterChipProps { label: string; value: string; onRemove: () => void; }

export const FilterChip = memo(function FilterChip({ label, value, onRemove }: FilterChipProps) {
  return (
    <Badge variant="secondary" className="flex items-center gap-1 pr-1">
      <span className="text-muted-foreground">{label}:</span>
      <span>{value}</span>
      <button onClick={onRemove} className="ml-1 hover:bg-muted rounded-full p-0.5"><X className="h-3 w-3" /></button>
    </Badge>
  );
});
