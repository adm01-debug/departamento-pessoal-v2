// V15-204: src/components/forms/FormRadioGroup.tsx
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Option {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface FormRadioGroupProps {
  label?: string;
  error?: string;
  options: Option[];
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function FormRadioGroup({ label, error, options, value, onValueChange, disabled, orientation = 'vertical', className }: FormRadioGroupProps) {
  return (
    <div className="space-y-3">
      {label && <Label className={cn(error && 'text-destructive')}>{label}</Label>}
      <RadioGroup value={value} onValueChange={onValueChange} disabled={disabled} className={cn(orientation === 'horizontal' && 'flex gap-4', className)}>
        {options.map((opt) => (
          <div key={opt.value} className="flex items-start space-x-3">
            <RadioGroupItem value={opt.value} id={opt.value} disabled={opt.disabled} />
            <div className="space-y-1 leading-none">
              <Label htmlFor={opt.value} className="cursor-pointer">{opt.label}</Label>
              {opt.description && <p className="text-sm text-muted-foreground">{opt.description}</p>}
            </div>
          </div>
        ))}
      </RadioGroup>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
