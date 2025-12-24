/**
 * @fileoverview Input de checkbox
 * @module components/form/CheckboxInput
 */
import { memo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CheckboxInputProps { id: string; label: string; checked: boolean; onChange: (checked: boolean) => void; description?: string; disabled?: boolean; }

export const CheckboxInput = memo(function CheckboxInput({ id, label, checked, onChange, description, disabled }: CheckboxInputProps) {
  return (
    <div className="flex items-start gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor={id} className="cursor-pointer">{label}</Label>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
});
