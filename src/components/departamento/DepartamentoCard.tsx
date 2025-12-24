/**
 * @fileoverview Card de departamento
 * @module components/departamento/DepartamentoCard
 */
import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Users, Briefcase, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DepartamentoCardProps {
  id: string;
  nome: string;
  sigla?: string;
  gestor?: { nome: string; avatar?: string; };
  colaboradoresCount?: number;
  cargosCount?: number;
  ativo?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
}

/**
 * Card com informações do departamento
 */
export const DepartamentoCard = memo(function DepartamentoCard({
  id, nome, sigla, gestor, colaboradoresCount = 0, cargosCount = 0, ativo = true, onEdit, onDelete, onClick
}: DepartamentoCardProps) {
  const initials = gestor?.nome.split(' ').map(n => n[0]).join('').slice(0, 2) || '?';

  return (
    <Card className={`hover:border-primary/30 transition-colors cursor-pointer ${!ativo ? 'opacity-60' : ''}`} onClick={() => onClick?.(id)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="rounded-full p-2 bg-blue-100">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">{nome}</h3>
              {sigla && <Badge variant="outline" className="mt-1">{sigla}</Badge>}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(id); }}><Pencil className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>}
              {onDelete && <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(id); }} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Excluir</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {gestor && (
          <div className="flex items-center gap-2 mt-3 text-sm">
            <Avatar className="h-6 w-6">
              <AvatarImage src={gestor.avatar} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground">Gestor: {gestor.nome}</span>
          </div>
        )}
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Users className="h-4 w-4" />{colaboradoresCount}</span>
          <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{cargosCount} cargos</span>
        </div>
      </CardContent>
    </Card>
  );
});
