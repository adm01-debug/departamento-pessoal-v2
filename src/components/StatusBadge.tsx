import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
  ativo: { variant: 'default', className: 'bg-green-500 hover:bg-green-600' },
  inativo: { variant: 'secondary' },
  pendente: { variant: 'outline', className: 'border-yellow-500 text-yellow-600' },
  aprovado: { variant: 'default', className: 'bg-blue-500 hover:bg-blue-600' },
  rejeitado: { variant: 'destructive' },
  cancelado: { variant: 'secondary', className: 'line-through' },
  em_gozo: { variant: 'default', className: 'bg-purple-500 hover:bg-purple-600' },
  concluido: { variant: 'secondary', className: 'bg-gray-500' },
  ferias: { variant: 'default', className: 'bg-cyan-500 hover:bg-cyan-600' },
  afastado: { variant: 'outline', className: 'border-orange-500 text-orange-600' },
  aberta: { variant: 'outline', className: 'border-blue-500 text-blue-600' },
  processando: { variant: 'default', className: 'bg-yellow-500 hover:bg-yellow-600' },
  fechada: { variant: 'secondary', className: 'bg-gray-600' },
};

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export const StatusBadge = memo(function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const style = statusStyles[status.toLowerCase()] || { variant: 'secondary' as const };
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');

  return <Badge variant={style.variant} className={cn(style.className, className)}>{displayLabel}</Badge>;
});

export default StatusBadge;
