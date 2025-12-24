/**
 * @fileoverview Checkbox wrapper
 * @module components/forms/Checkbox
 */
import { memo } from 'react';
import { Checkbox as CheckboxUI } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CheckboxProps { id: string; label: string; checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean; }

export const Checkbox = memo(function Checkbox({ id, label, checked, onChange, disabled }: CheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <CheckboxUI id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} />
      <Label htmlFor={id} className="cursor-pointer">{label}</Label>
    </div>
  );
});
