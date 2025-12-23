import { memo, forwardRef } from 'react';
import { Input } from '@/components/ui/input';

interface MoneyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: number) => void;
}

export const MoneyInput = memo(forwardRef<HTMLInputElement, MoneyInputProps>(
  function MoneyInput({ onChange, value, ...props }, ref) {
    const formatMoney = (val: number): string => {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '');
      const numValue = parseInt(raw, 10) / 100;
      onChange?.(isNaN(numValue) ? 0 : numValue);
    };

    return (
      <Input
        ref={ref}
        value={formatMoney(Number(value) || 0)}
        onChange={handleChange}
        placeholder="R$ 0,00"
        aria-label="Valor"
        {...props}
      />
    );
  }
));

export default MoneyInput;
