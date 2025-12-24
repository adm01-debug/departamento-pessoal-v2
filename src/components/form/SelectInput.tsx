/**
 * @fileoverview Input de select
 * @module components/form/SelectInput
 */
import { memo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface SelectInputProps { id: string; label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string; required?: boolean; disabled?: boolean; error?: string; }

export const SelectInput = memo(function SelectInput({ id, label, value, onChange, options, placeholder = 'Selecione', required, disabled, error }: SelectInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}{required && <span className="text-red-500 ml-1">*</span>}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={id} className={error ? 'border-red-500' : ''}><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>{options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});
