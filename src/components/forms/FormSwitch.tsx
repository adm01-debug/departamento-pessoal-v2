// V15-203: src/components/forms/FormSwitch.tsx
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface FormSwitchProps {
  id?: string;
  name?: string;
  label: string;
  description?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function FormSwitch({ id, name, label, description, checked, onCheckedChange, disabled, className }: FormSwitchProps) {
  const inputId = id || name;
  return (
    <div className={cn('flex items-center justify-between space-x-3', className)}>
      <div className="space-y-1">
        <Label htmlFor={inputId}>{label}</Label>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <Switch id={inputId} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  );
}
