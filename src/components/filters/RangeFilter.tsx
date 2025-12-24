/**
 * @fileoverview Filtro de intervalo
 * @module components/filters/RangeFilter
 */
import { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RangeFilterProps { label: string; min: string; max: string; onMinChange: (v: string) => void; onMaxChange: (v: string) => void; type?: 'number' | 'date'; }

export const RangeFilter = memo(function RangeFilter({ label, min, max, onMinChange, onMaxChange, type = 'number' }: RangeFilterProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2 items-center">
        <Input type={type} value={min} onChange={e => onMinChange(e.target.value)} placeholder="De" />
        <span className="text-muted-foreground">até</span>
        <Input type={type} value={max} onChange={e => onMaxChange(e.target.value)} placeholder="Até" />
      </div>
    </div>
  );
});
