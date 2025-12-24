/**
 * @fileoverview Select wrapper
 * @module components/forms/Select
 */
import { memo } from 'react';
import { Select as S, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SelectProps { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string; }

export const Select = memo(function Select({ value, onChange, options, placeholder = 'Selecione' }: SelectProps) {
  return (
    <S value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>{options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
    </S>
  );
});
