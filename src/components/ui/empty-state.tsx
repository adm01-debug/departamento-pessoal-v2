import { cn } from '@/lib/utils';
import { LucideIcon, Inbox, Search, FileX, Plus } from 'lucide-react';
import { Button } from './button';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', bounce: 0.4 }}
        className="rounded-2xl bg-muted/50 p-5 mb-5"
      >
        <Icon className="h-8 w-8 text-muted-foreground" />
      </motion.div>
      <h3 className="text-lg font-display font-semibold text-foreground mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground font-body mb-5 max-w-sm">{description}</p>}
      {action && (
        <Button onClick={action.onClick} className="gap-2 rounded-xl shadow-glow">
          <Plus className="h-4 w-4" />
          {action.label}
        </Button>
      )}
    </motion.div>
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
      description={`Não há ${entityName} cadastrados ainda. Comece criando o primeiro!`}
      action={onCreate ? { label: `Criar ${entityName}`, onClick: onCreate } : undefined}
    />
  );
}
