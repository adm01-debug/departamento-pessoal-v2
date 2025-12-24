/**
 * @fileoverview Card de cargo
 * @module components/cargo/CargoCard
 */
import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, DollarSign, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface CargoCardProps {
  id: string;
  nome: string;
  departamento?: string;
  cbo?: string;
  salarioBase?: number;
  colaboradoresCount?: number;
  ativo?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

/**
 * Card com informações do cargo
 */
export const CargoCard = memo(function CargoCard({
  id, nome, departamento, cbo, salarioBase, colaboradoresCount = 0, ativo = true, onEdit, onDelete
}: CargoCardProps) {
  return (
    <Card className={`hover:border-primary/30 transition-colors ${!ativo ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="rounded-full p-2 bg-primary/10">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{nome}</h3>
              {departamento && <p className="text-sm text-muted-foreground">{departamento}</p>}
              {cbo && <p className="text-xs text-muted-foreground">CBO: {cbo}</p>}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && <DropdownMenuItem onClick={() => onEdit(id)}><Pencil className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>}
              {onDelete && <DropdownMenuItem onClick={() => onDelete(id)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Excluir</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{colaboradoresCount}</span>
          </div>
          {salarioBase && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>R$ {salarioBase.toLocaleString('pt-BR')}</span>
            </div>
          )}
          <Badge variant={ativo ? 'default' : 'secondary'}>{ativo ? 'Ativo' : 'Inativo'}</Badge>
        </div>
      </CardContent>
    </Card>
  );
});
