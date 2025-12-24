/**
 * @fileoverview Input de data
 * @module components/form/DateInput
 */
import { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';

interface DateInputProps { id: string; label: string; value: string; onChange: (v: string) => void; required?: boolean; disabled?: boolean; error?: string; }

export const DateInput = memo(function DateInput({ id, label, value, onChange, required, disabled, error }: DateInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}{required && <span className="text-red-500 ml-1">*</span>}</Label>
      <div className="relative">
        <Input id={id} type="date" value={value} onChange={e => onChange(e.target.value)} disabled={disabled} className={error ? 'border-red-500' : ''} />
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});
