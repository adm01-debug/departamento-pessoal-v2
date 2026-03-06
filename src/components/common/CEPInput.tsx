import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { maskCEP } from '@/utils/masks';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onAddressFound?: (endereco: any) => void;
  disabled?: boolean;
  error?: string;
}

export function CEPInput({ value, onChange, onAddressFound, disabled, error }: Props) {
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCEP(e.target.value);
    onChange(masked);
  };

  const handleSearch = async () => {
    const cleanCep = value.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;
    setLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();
      if (!data.erro && onAddressFound) {
        onAddressFound({
          cep: data.cep,
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          uf: data.uf,
        });
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Input value={value} onChange={handleChange} disabled={disabled} placeholder="00000-000" maxLength={9} className={error ? 'border-destructive' : ''} />
        {error && <span className="text-sm text-destructive">{error}</span>}
      </div>
      <Button type="button" variant="outline" onClick={handleSearch} disabled={loading || value.length < 9}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
      </Button>
    </div>
  );
}
