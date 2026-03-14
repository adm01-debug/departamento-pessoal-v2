import React from 'react';
import { Input } from '@/components/ui/input';
import { maskCNPJ } from '@/lib/masks';

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export function CNPJInput({ value, onChange, disabled, error }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCNPJ(e.target.value);
    onChange(masked);
  };

  return (
    <div>
      <Input value={value} onChange={handleChange} disabled={disabled} placeholder="00.000.000/0000-00" maxLength={18} className={error ? 'border-destructive' : ''} />
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  );
}