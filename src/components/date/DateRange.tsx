import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
interface DateRangeProps { start: Date | string; end: Date | string; showDays?: boolean; className?: string; }
export function DateRange({ start, end, showDays = false, className }: DateRangeProps) {
  const s = typeof start === 'string' ? new Date(start) : start;
  const e = typeof end === 'string' ? new Date(end) : end;
  const days = differenceInDays(e, s);
  return <span className={className}>{format(s, 'dd/MM/yyyy', { locale: ptBR })} - {format(e, 'dd/MM/yyyy', { locale: ptBR })}{showDays && ` (${days} dias)`}</span>;
}
