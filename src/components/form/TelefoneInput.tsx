import { memo, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { formatarTelefone } from '@/lib/masks';

interface TelefoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string) => void;
}

export const TelefoneInput = memo(forwardRef<HTMLInputElement, TelefoneInputProps>(
  function TelefoneInput({ onChange, value, ...props }, ref) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
      onChange?.(raw);
    };

    return (
      <Input
        ref={ref}
        value={formatarTelefone(String(value ?? ''))}
        onChange={handleChange}
        placeholder="(00) 00000-0000"
        aria-label="Telefone"
        {...props}
      />
    );
  }
));

export default TelefoneInput;

TelefoneInput.displayName = 'TelefoneInput';
