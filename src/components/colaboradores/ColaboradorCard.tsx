/**
 * @fileoverview Card de colaborador com informações resumidas
 * @module components/colaboradores/ColaboradorCard
 */
import { memo } from 'react';
import { User, Mail, Phone, Building, Calendar, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ColaboradorCardProps {
  id: string;
  nome: string;
  cargo?: string;
  departamento?: string;
  email?: string;
  telefone?: string;
  dataAdmissao?: string;
  foto?: string;
  status?: 'ativo' | 'inativo' | 'ferias' | 'afastado';
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusConfig = {
  ativo: { label: 'Ativo', variant: 'default' as const, color: 'bg-green-500' },
  inativo: { label: 'Inativo', variant: 'secondary' as const, color: 'bg-gray-500' },
  ferias: { label: 'Férias', variant: 'outline' as const, color: 'bg-blue-500' },
  afastado: { label: 'Afastado', variant: 'destructive' as const, color: 'bg-yellow-500' },
};

export const ColaboradorCard = memo(function ColaboradorCard({
  id, nome, cargo, departamento, email, telefone, dataAdmissao, foto, status = 'ativo', onEdit, onView, onDelete
}: ColaboradorCardProps) {
  const initials = nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const config = statusConfig[status];

  return (
    <Card className="hover:border-primary/30 transition-colors group">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={foto} alt={nome} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${config.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium truncate">{nome}</h3>
                {cargo && <p className="text-sm text-muted-foreground">{cargo}</p>}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onView && <DropdownMenuItem onClick={() => onView(id)}>Ver detalhes</DropdownMenuItem>}
                  {onEdit && <DropdownMenuItem onClick={() => onEdit(id)}>Editar</DropdownMenuItem>}
                  {onDelete && <DropdownMenuItem onClick={() => onDelete(id)} className="text-destructive">Excluir</DropdownMenuItem>}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-2 space-y-1">
              {departamento && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Building className="h-3 w-3" />{departamento}</div>}
              {email && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="h-3 w-3" />{email}</div>}
              {dataAdmissao && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="h-3 w-3" />Admissão: {dataAdmissao}</div>}
            </div>
            <Badge variant={config.variant} className="mt-2">{config.label}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

