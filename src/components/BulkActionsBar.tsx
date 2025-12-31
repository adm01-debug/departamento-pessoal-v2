import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Trash2, Archive, RotateCcw, MoreHorizontal, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface BulkAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive';
  onClick: () => void;
}

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  actions: BulkAction[];
  isExecuting?: boolean;
  className?: string;
  position?: 'top' | 'bottom' | 'floating';
}

export const BulkActionsBar = memo(function BulkActionsBar({
  selectedCount,
  onClearSelection,
  actions,
  isExecuting = false,
  className,
  position = 'top',
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  const mainActions = actions.slice(0, 3);
  const moreActions = actions.slice(3);

  const positionClasses = {
    top: 'rounded-lg',
    bottom: 'rounded-lg',
    floating: 'fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full shadow-lg z-50',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 bg-primary/10 border border-primary/20 px-4 py-2 animate-in slide-in-from-top-2',
        positionClasses[position],
        className
      )}
    >
      {/* Contador */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="font-mono">
          {selectedCount}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {selectedCount === 1 ? 'item selecionado' : 'itens selecionados'}
        </span>
      </div>

      {/* Separador */}
      <div className="h-4 w-px bg-border" />

      {/* Ações principais */}
      <div className="flex items-center gap-1">
        {mainActions.map((action) => (
          <Button
            key={action.key}
            variant={action.variant === 'destructive' ? 'destructive' : 'ghost'}
            size="sm"
            onClick={action.onClick}
            disabled={isExecuting}
            className="gap-1.5"
          >
            {isExecuting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              action.icon
            )}
            <span className="hidden sm:inline">{action.label}</span>
          </Button>
        ))}

        {/* Menu de mais ações */}
        {moreActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={isExecuting}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {moreActions.map((action) => (
                <DropdownMenuItem
                  key={action.key}
                  onClick={action.onClick}
                  className={cn(
                    'gap-2',
                    action.variant === 'destructive' && 'text-destructive'
                  )}
                >
                  {action.icon}
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Limpar seleção */}
      <div className="ml-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          disabled={isExecuting}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
          <span className="hidden sm:inline">Limpar</span>
        </Button>
      </div>
    </div>
  );
});

/**
 * Ações padrão comuns
 */
export const defaultBulkActions = {
  delete: (onClick: () => void): BulkAction => ({
    key: 'delete',
    label: 'Excluir',
    icon: <Trash2 className="h-4 w-4" />,
    variant: 'destructive',
    onClick,
  }),

  archive: (onClick: () => void): BulkAction => ({
    key: 'archive',
    label: 'Arquivar',
    icon: <Archive className="h-4 w-4" />,
    onClick,
  }),

  restore: (onClick: () => void): BulkAction => ({
    key: 'restore',
    label: 'Restaurar',
    icon: <RotateCcw className="h-4 w-4" />,
    onClick,
  }),
};

export default BulkActionsBar;
