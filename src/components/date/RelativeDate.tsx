import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
interface RelativeDateProps { date: Date | string; className?: string; }
export function RelativeDate({ date, className }: RelativeDateProps) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return <time dateTime={d.toISOString()} className={className} title={format(d, 'PPpp', { locale: ptBR })}>{formatDistanceToNow(d, { addSuffix: true, locale: ptBR })}</time>;
}
