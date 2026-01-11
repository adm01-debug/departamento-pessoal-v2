// V15-178: src/components/ui/status-badge.tsx
import { cn } from '@/lib/utils';
import { Badge } from './badge';

type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200',
};

export function StatusBadge({ status, variant = 'default', className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(variantStyles[variant], className)}>
      {status}
    </Badge>
  );
}

// Helpers para status comuns
export function ColaboradorStatus({ status }: { status: string }) {
  const variants: Record<string, StatusVariant> = {
    ativo: 'success', inativo: 'default', ferias: 'info', afastado: 'warning', demitido: 'error',
  };
  const labels: Record<string, string> = {
    ativo: 'Ativo', inativo: 'Inativo', ferias: 'Férias', afastado: 'Afastado', demitido: 'Demitido',
  };
  return <StatusBadge status={labels[status] || status} variant={variants[status] || 'default'} />;
}

export function FolhaStatus({ status }: { status: string }) {
  const variants: Record<string, StatusVariant> = {
    rascunho: 'default', calculada: 'info', conferida: 'warning', fechada: 'success', paga: 'success',
  };
  const labels: Record<string, string> = {
    rascunho: 'Rascunho', calculada: 'Calculada', conferida: 'Conferida', fechada: 'Fechada', paga: 'Paga',
  };
  return <StatusBadge status={labels[status] || status} variant={variants[status] || 'default'} />;
}
