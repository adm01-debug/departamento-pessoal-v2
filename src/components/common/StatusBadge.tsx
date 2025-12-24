/**
 * @fileoverview Badge de status
 * @module components/common/StatusBadge
 */
import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps { status: 'ativo' | 'inativo' | 'pendente' | 'aprovado' | 'rejeitado' | 'cancelado'; }

const statusConfig = {
  ativo: { label: 'Ativo', className: 'bg-green-100 text-green-800' },
  inativo: { label: 'Inativo', className: 'bg-gray-100 text-gray-800' },
  pendente: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
  aprovado: { label: 'Aprovado', className: 'bg-green-100 text-green-800' },
  rejeitado: { label: 'Rejeitado', className: 'bg-red-100 text-red-800' },
  cancelado: { label: 'Cancelado', className: 'bg-gray-100 text-gray-800' },
};

export const StatusBadge = memo(function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant="outline" className={cn('font-medium', config.className)}>{config.label}</Badge>;
});
