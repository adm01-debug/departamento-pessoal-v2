// V15-191: src/components/ui/cnpj-input.tsx
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';

interface CNPJInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onValidate?: (valid: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export function CNPJInput({ value: controlledValue, onChange, onValidate, className, disabled }: CNPJInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (controlledValue) setDisplayValue(formatCNPJ(controlledValue));
  }, [controlledValue]);

  const formatCNPJ = (value: string): string => {
    const cleaned = value.replace(/\D/g, '').slice(0, 14);
    return cleaned.replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})/, '$1-$2');
  };

  const validateCNPJ = (cnpj: string): boolean => {
    const cleaned = cnpj.replace(/\D/g, '');
    if (cleaned.length !== 14 || /^(\d)+$/.test(cleaned)) return false;
    const calc = (x: number) => {
      const slice = cleaned.slice(0, x);
      let factor = x - 7, sum = 0;
      for (let i = x; i >= 1; i--) { sum += parseInt(slice[x - i]) * factor--; if (factor < 2) factor = 9; }
      const result = 11 - (sum % 11);
      return result > 9 ? 0 : result;
    };
    return calc(12) === parseInt(cleaned[12]) && calc(13) === parseInt(cleaned[13]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setDisplayValue(formatted);
    const raw = e.target.value.replace(/\D/g, '');
    onChange?.(raw);
    if (raw.length === 14) onValidate?.(validateCNPJ(raw));
  };

  return <Input value={displayValue} onChange={handleChange} placeholder="00.000.000/0000-00" className={cn(className)} disabled={disabled} maxLength={18} />;
}
