import { memo, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { formatarCPF } from '@/lib/masks';

interface CpfInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string) => void;
}

export const CpfInput = memo(forwardRef<HTMLInputElement, CpfInputProps>(
  function CpfInput({ onChange, value, ...props }, ref) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
      onChange?.(raw);
    };

    return (
      <Input
        ref={ref}
        value={formatarCPF(String(value ?? ''))}
        onChange={handleChange}
        placeholder="000.000.000-00"
        aria-label="CPF"
        {...props}
      />
    );
  }
));

export default CpfInput;
