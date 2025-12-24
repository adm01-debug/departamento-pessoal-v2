/**
 * @fileoverview TimePicker wrapper
 * @module components/forms/TimePicker
 */
import { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';

interface TimePickerProps { id: string; label: string; value: string; onChange: (v: string) => void; disabled?: boolean; }

export const TimePicker = memo(function TimePicker({ id, label, value, onChange, disabled }: TimePickerProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input id={id} type="time" value={value} onChange={e => onChange(e.target.value)} disabled={disabled} />
        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
});
