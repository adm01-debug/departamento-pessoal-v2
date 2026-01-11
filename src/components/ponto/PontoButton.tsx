// V15-257: src/components/ponto/PontoButton.tsx
import { Button } from '@/components/ui/button';
import { LogIn, Coffee, LogOut, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type TipoRegistro = 'entrada' | 'saida_almoco' | 'retorno_almoco' | 'saida';

interface PontoButtonProps {
  tipo: TipoRegistro;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const config: Record<TipoRegistro, { label: string; icon: any; color: string }> = {
  entrada: { label: 'Entrada', icon: LogIn, color: 'bg-green-600 hover:bg-green-700' },
  saida_almoco: { label: 'Saída Almoço', icon: Coffee, color: 'bg-yellow-600 hover:bg-yellow-700' },
  retorno_almoco: { label: 'Retorno Almoço', icon: Coffee, color: 'bg-blue-600 hover:bg-blue-700' },
  saida: { label: 'Saída', icon: LogOut, color: 'bg-red-600 hover:bg-red-700' },
};

export function PontoButton({ tipo, onClick, loading, disabled }: PontoButtonProps) {
  const { label, icon: Icon, color } = config[tipo];
  return (
    <Button onClick={onClick} disabled={disabled || loading} className={cn('text-white', color)}>
      {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Icon className="h-4 w-4 mr-2" />}
      {label}
    </Button>
  );
}
