// V15-177: src/components/ui/empty-state.tsx
import { cn } from '@/lib/utils';
import { LucideIcon, Inbox, Search, FileX } from 'lucide-react';
import { Button } from './button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-4 max-w-sm">{description}</p>}
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}

export function EmptySearch({ search, onClear }: { search?: string; onClear?: () => void }) {
  return (
    <EmptyState
      icon={Search}
      title="Nenhum resultado encontrado"
      description={search ? `Não encontramos resultados para "${search}"` : 'Tente ajustar seus filtros'}
      action={onClear ? { label: 'Limpar busca', onClick: onClear } : undefined}
    />
  );
}

export function EmptyList({ entityName = 'registros', onCreate }: { entityName?: string; onCreate?: () => void }) {
  return (
    <EmptyState
      icon={FileX}
      title={`Nenhum ${entityName} encontrado`}
      description={`Não há ${entityName} cadastrados ainda.`}
      action={onCreate ? { label: `Criar ${entityName}`, onClick: onCreate } : undefined}
    />
  );
}
