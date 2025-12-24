/**
 * @fileoverview DatePicker wrapper
 * @module components/forms/DatePicker
 */
import { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DatePickerProps { id: string; label: string; value: string; onChange: (v: string) => void; disabled?: boolean; }

export const DatePicker = memo(function DatePicker({ id, label, value, onChange, disabled }: DatePickerProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type="date" value={value} onChange={e => onChange(e.target.value)} disabled={disabled} />
    </div>
  );
});
