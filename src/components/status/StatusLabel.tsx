import { cn } from '@/lib/utils';
import { StatusIndicator } from './StatusIndicator';
const statusLabels = { success: 'Sucesso', error: 'Erro', warning: 'Atenção', info: 'Info', pending: 'Pendente' };
interface StatusLabelProps { status: keyof typeof statusLabels; label?: string; className?: string; }
export function StatusLabel({ status, label, className }: StatusLabelProps) {
  return (<span className={cn('inline-flex items-center gap-2', className)}><StatusIndicator status={status} /><span className="text-sm">{label || statusLabels[status]}</span></span>);
}
