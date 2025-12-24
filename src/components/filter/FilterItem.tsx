/**
 * @fileoverview Item de filtro
 * @module components/filter/FilterItem
 */
import { memo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FilterItemProps { id: string; label: string; checked: boolean; onChange: (checked: boolean) => void; count?: number; }

export const FilterItem = memo(function FilterItem({ id, label, checked, onChange, count }: FilterItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
        <Label htmlFor={id} className="cursor-pointer">{label}</Label>
      </div>
      {count !== undefined && <span className="text-xs text-muted-foreground">{count}</span>}
    </div>
  );
});
