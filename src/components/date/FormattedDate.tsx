import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
interface FormattedDateProps { date: Date | string; pattern?: string; className?: string; }
export function FormattedDate({ date, pattern = 'dd/MM/yyyy', className }: FormattedDateProps) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return <time dateTime={d.toISOString()} className={className}>{format(d, pattern, { locale: ptBR })}</time>;
}
