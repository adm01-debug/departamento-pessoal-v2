import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  pendente: { label: 'Pendente', className: 'bg-warning/15 text-warning border-warning/30' },
  em_andamento: { label: 'Em Andamento', className: 'bg-info/15 text-info border-info/30' },
  concluido: { label: 'Concluído', className: 'bg-success/15 text-success border-success/30' },
  finalizado: { label: 'Finalizado', className: 'bg-success/15 text-success border-success/30' },
  cancelado: { label: 'Cancelado', className: 'bg-destructive/15 text-destructive border-destructive/30' },
};

const TIPO_MAP: Record<string, { label: string; className: string }> = {
  sem_justa_causa: { label: 'Sem Justa Causa', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  com_justa_causa: { label: 'Justa Causa', className: 'bg-destructive/20 text-destructive border-destructive/40' },
  pedido_demissao: { label: 'Pedido Demissão', className: 'bg-warning/10 text-warning border-warning/20' },
  acordo_mutuo: { label: 'Acordo Mútuo', className: 'bg-info/10 text-info border-info/20' },
  termino_contrato: { label: 'Término Contrato', className: 'bg-muted text-muted-foreground border-border/30' },
};

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_MAP[status] || { label: status, className: 'bg-muted text-muted-foreground' };
  return <Badge variant="outline" className={cn('text-[10px] font-body', config.className)}>{config.label}</Badge>;
}

export function TipoBadge({ tipo }: { tipo: string }) {
  const config = TIPO_MAP[tipo] || { label: tipo, className: 'bg-muted text-muted-foreground' };
  return <Badge variant="outline" className={cn('text-[10px] font-body', config.className)}>{config.label}</Badge>;
}
