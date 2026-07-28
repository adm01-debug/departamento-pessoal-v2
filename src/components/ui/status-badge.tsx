import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { motion } from 'framer-motion';

type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

type StatusType = 'ativo' | 'inativo' | 'ferias' | 'afastado' | 'desligado' | 'demitido' | 'pendente' | 'aprovado' | 'rejeitado' | 'processando';

const statusConfig: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  ativo: { label: 'Ativo', dot: 'bg-success', bg: 'bg-success/10', text: 'text-success' },
  inativo: { label: 'Inativo', dot: 'bg-muted-foreground', bg: 'bg-muted/50', text: 'text-muted-foreground' },
  ferias: { label: 'Férias', dot: 'bg-info', bg: 'bg-info/10', text: 'text-info' },
  afastado: { label: 'Afastado', dot: 'bg-warning', bg: 'bg-warning/10', text: 'text-warning' },
  desligado: { label: 'Desligado', dot: 'bg-destructive', bg: 'bg-destructive/10', text: 'text-destructive' },
  demitido: { label: 'Demitido', dot: 'bg-destructive', bg: 'bg-destructive/10', text: 'text-destructive' },
  pendente: { label: 'Pendente', dot: 'bg-warning', bg: 'bg-warning/10', text: 'text-warning' },
  aprovado: { label: 'Aprovado', dot: 'bg-success', bg: 'bg-success/10', text: 'text-success' },
  rejeitado: { label: 'Rejeitado', dot: 'bg-destructive', bg: 'bg-destructive/10', text: 'text-destructive' },
  processando: { label: 'Processando', dot: 'bg-info', bg: 'bg-info/10', text: 'text-info' },
  rascunho: { label: 'Rascunho', dot: 'bg-muted-foreground', bg: 'bg-muted/50', text: 'text-muted-foreground' },
  calculada: { label: 'Calculada', dot: 'bg-info', bg: 'bg-info/10', text: 'text-info' },
  conferida: { label: 'Conferida', dot: 'bg-warning', bg: 'bg-warning/10', text: 'text-warning' },
  fechada: { label: 'Fechada', dot: 'bg-success', bg: 'bg-success/10', text: 'text-success' },
  paga: { label: 'Paga', dot: 'bg-success', bg: 'bg-success/10', text: 'text-success' },
};

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export function StatusBadge({ status, variant, size = 'md', pulse = false, className }: StatusBadgeProps) {
  const key = status.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const config = statusConfig[key];

  // Use new animated design if config found, otherwise fallback to variant
  if (config) {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-body font-medium',
          config.bg, config.text,
          size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
          className
        )}
      >
        <span className={cn('rounded-full shrink-0', config.dot, pulse && 'animate-pulse',
          size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2'
        )} />
        {config.label}
      </motion.span>
    );
  }

  // Fallback for unknown statuses
  const variantStyles: Record<StatusVariant, string> = {
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    error: 'bg-destructive/10 text-destructive border-destructive/20',
    info: 'bg-info/10 text-info border-info/20',
    default: 'bg-muted/50 text-muted-foreground border-border/30',
  };

  return (
    <Badge variant="outline" className={cn('rounded-full font-body', variantStyles[variant || 'default'], className)}>
      {status}
    </Badge>
  );
}

// Helpers para status comuns
export function ColaboradorStatus({ status }: { status: string }) {
  return <StatusBadge status={status} pulse={status === 'ativo'} />;
}

export function FolhaStatus({ status }: { status: string }) {
  return <StatusBadge status={status} />;
}
