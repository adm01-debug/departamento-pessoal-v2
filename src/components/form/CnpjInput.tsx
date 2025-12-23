import { memo, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { formatarCNPJ } from '@/lib/masks';

interface CnpjInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string) => void;
}

export const CnpjInput = memo(forwardRef<HTMLInputElement, CnpjInputProps>(
  function CnpjInput({ onChange, value, ...props }, ref) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '').slice(0, 14);
      onChange?.(raw);
    };

    return (
      <Input
        ref={ref}
        value={formatarCNPJ(String(value ?? ''))}
        onChange={handleChange}
        placeholder="00.000.000/0000-00"
        aria-label="CNPJ"
        {...props}
      />
    );
  }
));

export default CnpjInput;

CnpjInput.displayName = 'CnpjInput';
