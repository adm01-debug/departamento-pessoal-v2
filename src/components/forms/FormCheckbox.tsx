// V15-202: src/components/forms/FormCheckbox.tsx
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FormCheckboxProps {
  id?: string;
  name?: string;
  label: string;
  description?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function FormCheckbox({ id, name, label, description, checked, onCheckedChange, disabled, className }: FormCheckboxProps) {
  const inputId = id || name;
  return (
    <div className={cn('flex items-start space-x-3', className)}>
      <Checkbox id={inputId} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
      <div className="space-y-1 leading-none">
        <Label htmlFor={inputId} className="cursor-pointer">{label}</Label>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
