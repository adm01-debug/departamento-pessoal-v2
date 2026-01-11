// V15-192: src/components/ui/cep-input.tsx
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { Button } from './button';
import { Loader2, Search } from 'lucide-react';

interface CEPInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onAddressFound?: (address: Address) => void;
  className?: string;
  disabled?: boolean;
}

interface Address {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export function CEPInput({ value: controlledValue, onChange, onAddressFound, className, disabled }: CEPInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (controlledValue) setDisplayValue(formatCEP(controlledValue));
  }, [controlledValue]);

  const formatCEP = (value: string): string => {
    const cleaned = value.replace(/\D/g, '').slice(0, 8);
    return cleaned.replace(/(\d{5})(\d)/, '$1-$2');
  };

  const searchCEP = async () => {
    const cep = displayValue.replace(/\D/g, '');
    if (cep.length !== 8) return;
    setLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        onAddressFound?.({ cep: data.cep, logradouro: data.logradouro, bairro: data.bairro, cidade: data.localidade, uf: data.uf });
      }
    } catch { } finally { setLoading(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    setDisplayValue(formatted);
    onChange?.(e.target.value.replace(/\D/g, ''));
  };

  return (
    <div className="flex gap-2">
      <Input value={displayValue} onChange={handleChange} placeholder="00000-000" className={cn(className)} disabled={disabled} maxLength={9} />
      <Button type="button" variant="outline" size="icon" onClick={searchCEP} disabled={disabled || loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
      </Button>
    </div>
  );
}
