/**
 * @fileoverview RadioGroup wrapper
 * @module components/forms/RadioGroup
 */
import { memo } from 'react';
import { RadioGroup as RG, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface RadioGroupProps { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; }

export const RadioGroup = memo(function RadioGroup({ value, onChange, options }: RadioGroupProps) {
  return (
    <RG value={value} onValueChange={onChange}>
      {options.map(o => (
        <div key={o.value} className="flex items-center gap-2">
          <RadioGroupItem value={o.value} id={o.value} />
          <Label htmlFor={o.value}>{o.label}</Label>
        </div>
      ))}
    </RG>
  );
});
