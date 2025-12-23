import { memo, forwardRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { formatarCEP } from '@/lib/masks';

interface CepInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string) => void;
  onAddressFound?: (address: { logradouro: string; bairro: string; cidade: string; uf: string }) => void;
}

export const CepInput = memo(forwardRef<HTMLInputElement, CepInputProps>(
  function CepInput({ onChange, onAddressFound, value, ...props }, ref) {
    const [loading, setLoading] = useState(false);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '').slice(0, 8);
      onChange?.(raw);

      if (raw.length === 8 && onAddressFound) {
        setLoading(true);
        try {
          const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
          const data = await res.json();
          if (!data.erro) {
            onAddressFound({
              logradouro: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              uf: data.uf,
            });
          }
        } catch {} finally { setLoading(false); }
      }
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          value={formatarCEP(String(value ?? ''))}
          onChange={handleChange}
          placeholder="00000-000"
          aria-label="CEP"
          {...props}
        />
        {loading && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin" />}
      </div>
    );
  }
));

export default CepInput;



