/**
 * @fileoverview Card de usuário
 * @module components/usuarios/UsuarioCard
 */
import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash2, Shield, Mail } from 'lucide-react';

interface UsuarioCardProps {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
  perfil: 'admin' | 'gestor' | 'usuario';
  ativo: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const perfilConfig = {
  admin: { label: 'Admin', variant: 'default' as const },
  gestor: { label: 'Gestor', variant: 'secondary' as const },
  usuario: { label: 'Usuário', variant: 'outline' as const },
};

export const UsuarioCard = memo(function UsuarioCard({
  id, nome, email, avatar, perfil, ativo, onEdit, onDelete
}: UsuarioCardProps) {
  const initials = nome.split(' ').map(n => n[0]).slice(0, 2).join('');
  const config = perfilConfig[perfil];

  return (
    <Card className={!ativo ? 'opacity-60' : ''}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar><AvatarImage src={avatar} /><AvatarFallback>{initials}</AvatarFallback></Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">{nome}</h3>
              {!ativo && <Badge variant="outline" className="text-red-500">Inativo</Badge>}
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={config.variant}><Shield className="h-3 w-3 mr-1" />{config.label}</Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(id)}><Edit className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
