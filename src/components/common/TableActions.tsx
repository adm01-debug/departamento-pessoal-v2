/**
 * @fileoverview Ações de tabela
 * @module components/common/TableActions
 */
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';

interface TableActionsProps { onView?: () => void; onEdit?: () => void; onDelete?: () => void; }

export const TableActions = memo(function TableActions({ onView, onEdit, onDelete }: TableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onView && <DropdownMenuItem onClick={onView}><Eye className="h-4 w-4 mr-2" />Visualizar</DropdownMenuItem>}
        {onEdit && <DropdownMenuItem onClick={onEdit}><Edit className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>}
        {onDelete && <><DropdownMenuSeparator /><DropdownMenuItem onClick={onDelete} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Excluir</DropdownMenuItem></>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
