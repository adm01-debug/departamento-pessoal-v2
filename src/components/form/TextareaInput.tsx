/**
 * @fileoverview Input de textarea
 * @module components/form/TextareaInput
 */
import { memo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TextareaInputProps { id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; disabled?: boolean; error?: string; rows?: number; }

export const TextareaInput = memo(function TextareaInput({ id, label, value, onChange, placeholder, required, disabled, error, rows = 3 }: TextareaInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}{required && <span className="text-red-500 ml-1">*</span>}</Label>
      <Textarea id={id} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} rows={rows} className={error ? 'border-red-500' : ''} />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});
