import { memo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ColaboradorHeaderProps {
  nome?: string;
  cargo?: string;
  departamento?: string;
  fotoUrl?: string;
  status?: 'ativo' | 'inativo' | 'afastado';
  className?: string;
}

const statusConfig = {
  ativo: { label: 'Ativo', variant: 'default' as const },
  inativo: { label: 'Inativo', variant: 'secondary' as const },
  afastado: { label: 'Afastado', variant: 'destructive' as const },
};

export const ColaboradorHeader = memo(function ColaboradorHeader({ 
  nome = 'Colaborador',
  cargo,
  departamento,
  fotoUrl,
  status = 'ativo',
  className 
}: ColaboradorHeaderProps) {
  const config = statusConfig[status];
  const initials = nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Avatar className="h-16 w-16">
        <AvatarImage src={fotoUrl} alt={nome} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{nome}</h2>
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>
        {cargo && <p className="text-muted-foreground">{cargo}</p>}
        {departamento && <p className="text-sm text-muted-foreground">{departamento}</p>}
      </div>
    </div>
  );
});

export default ColaboradorHeader;
