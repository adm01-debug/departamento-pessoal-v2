/**
 * @fileoverview Input de radio
 * @module components/form/RadioInput
 */
import { memo } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface RadioInputProps { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; orientation?: 'horizontal' | 'vertical'; }

export const RadioInput = memo(function RadioInput({ label, value, onChange, options, orientation = 'vertical' }: RadioInputProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <RadioGroup value={value} onValueChange={onChange} className={orientation === 'horizontal' ? 'flex gap-4' : 'space-y-2'}>
        {options.map(opt => (
          <div key={opt.value} className="flex items-center gap-2">
            <RadioGroupItem value={opt.value} id={opt.value} />
            <Label htmlFor={opt.value} className="cursor-pointer">{opt.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
});
