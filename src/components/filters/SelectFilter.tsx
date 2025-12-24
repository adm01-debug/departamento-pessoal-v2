/**
 * @fileoverview Filtro de seleção
 * @module components/filters/SelectFilter
 */
import { memo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SelectFilterProps { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string; }

export const SelectFilter = memo(function SelectFilter({ value, onChange, options, placeholder = 'Selecione' }: SelectFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>{options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
    </Select>
  );
});
