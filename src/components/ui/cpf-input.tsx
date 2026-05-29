// V15-190: src/components/ui/cpf-input.tsx
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';

interface CPFInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onValidate?: (valid: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const formatCPF = (value: string): string => {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  return cleaned.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2');
};

const validateCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  // Rejeita tamanho inválido ou todos os dígitos iguais (ex.: 111.111.111-11).
  if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cleaned[i]) * (10 - i);
  let d1 = (sum * 10) % 11; if (d1 === 10) d1 = 0;
  if (d1 !== parseInt(cleaned[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cleaned[i]) * (11 - i);
  let d2 = (sum * 10) % 11; if (d2 === 10) d2 = 0;
  return d2 === parseInt(cleaned[10]);
};

export function CPFInput({ value: controlledValue, onChange, onValidate, className, disabled }: CPFInputProps) {
  const [displayValue, setDisplayValue] = useState(controlledValue ? formatCPF(controlledValue) : '');
  const [lastControlled, setLastControlled] = useState(controlledValue);

  // Sincroniza com a prop controlada durante o render (sem useEffect/setState-in-effect).
  if (controlledValue !== lastControlled) {
    setLastControlled(controlledValue);
    setDisplayValue(controlledValue ? formatCPF(controlledValue) : '');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setDisplayValue(formatted);
    const raw = e.target.value.replace(/\D/g, '');
    onChange?.(raw);
    if (raw.length === 11) onValidate?.(validateCPF(raw));
  };

  return <Input value={displayValue} onChange={handleChange} placeholder="000.000.000-00" className={cn(className)} disabled={disabled} maxLength={14} />;
}
