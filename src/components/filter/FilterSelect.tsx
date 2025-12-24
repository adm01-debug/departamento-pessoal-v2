/**
 * @fileoverview Select para filtros
 * @module components/filter/FilterSelect
 */
import { memo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface FilterSelectProps { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string; }

export const FilterSelect = memo(function FilterSelect({ label, value, onChange, options, placeholder = 'Selecione' }: FilterSelectProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>{options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
});
