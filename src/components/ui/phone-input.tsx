// V15-189: src/components/ui/phone-input.tsx
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function PhoneInput({ value: controlledValue, onChange, placeholder = '(00) 00000-0000', className, disabled }: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (controlledValue) setDisplayValue(formatPhone(controlledValue));
  }, [controlledValue]);

  const formatPhone = (value: string): string => {
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setDisplayValue(formatted);
    onChange?.(e.target.value.replace(/\D/g, ''));
  };

  return <Input value={displayValue} onChange={handleChange} placeholder={placeholder} className={cn(className)} disabled={disabled} />;
}
