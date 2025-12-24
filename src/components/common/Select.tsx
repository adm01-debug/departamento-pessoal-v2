/**
 * @fileoverview Select customizado
 * @module components/common/Select
 */
import { memo } from 'react';
import { Select as ShadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Option { value: string; label: string; }
interface SelectProps { options: Option[]; value: string; onChange: (value: string) => void; placeholder?: string; disabled?: boolean; }

export const Select = memo(function Select({ options, value, onChange, placeholder = 'Selecione', disabled }: SelectProps) {
  return (
    <ShadSelect value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>
        {options.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
      </SelectContent>
    </ShadSelect>
  );
});
