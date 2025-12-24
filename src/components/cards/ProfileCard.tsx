/**
 * @fileoverview Card de perfil do usuário/colaborador
 * @module components/cards/ProfileCard
 */
import { memo } from 'react';
import { Mail, Phone, MapPin, Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ProfileCardProps {
  nome: string;
  cargo?: string;
  departamento?: string;
  email?: string;
  telefone?: string;
  localizacao?: string;
  foto?: string;
  status?: 'ativo' | 'inativo' | 'ferias';
}

const statusConfig = {
  ativo: { label: 'Ativo', variant: 'default' as const },
  inativo: { label: 'Inativo', variant: 'secondary' as const },
  ferias: { label: 'Férias', variant: 'outline' as const },
};

export const ProfileCard = memo(function ProfileCard({ nome, cargo, departamento, email, telefone, localizacao, foto, status }: ProfileCardProps) {
  const initials = nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={foto} alt={nome} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg">{nome}</h3>
          {cargo && <p className="text-sm text-muted-foreground">{cargo}</p>}
          {status && <Badge variant={statusConfig[status].variant} className="mt-2">{statusConfig[status].label}</Badge>}
        </div>
        <div className="mt-4 space-y-2">
          {departamento && (
            <div className="flex items-center gap-2 text-sm"><Building className="h-4 w-4 text-muted-foreground" /><span>{departamento}</span></div>
          )}
          {email && (
            <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /><span>{email}</span></div>
          )}
          {telefone && (
            <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /><span>{telefone}</span></div>
          )}
          {localizacao && (
            <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{localizacao}</span></div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

