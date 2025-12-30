import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ColaboradorActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export const ColaboradorActions = memo(function ColaboradorActions({ 
  onView,
  onEdit,
  onDelete,
  className 
}: ColaboradorActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onView && (
          <DropdownMenuItem onClick={onView}>
            <Eye className="h-4 w-4 mr-2" />
            Visualizar
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default ColaboradorActions;
