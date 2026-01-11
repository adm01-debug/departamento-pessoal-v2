// V15-247: src/components/colaborador/ColaboradorCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ColaboradorStatus } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Colaborador } from '@/types';

interface ColaboradorCardProps {
  colaborador: Colaborador;
}

export function ColaboradorCard({ colaborador }: ColaboradorCardProps) {
  const navigate = useNavigate();
  const initials = colaborador.nome.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            {colaborador.foto_url && <AvatarImage src={colaborador.foto_url} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{colaborador.nome}</p>
            <p className="text-sm text-muted-foreground truncate">{colaborador.cargo || 'Sem cargo'}</p>
          </div>
          <ColaboradorStatus status={colaborador.status} />
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/colaboradores/${colaborador.id}`)}>
            <Eye className="h-4 w-4 mr-1" />Ver
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/colaboradores/${colaborador.id}/editar`)}>
            <Edit className="h-4 w-4 mr-1" />Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
