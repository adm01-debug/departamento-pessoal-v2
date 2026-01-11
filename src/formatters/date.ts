// V15-316
import { format, parseISO, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import { ptBR } from 'date-fns/locale';
export function formatDate(date: string | Date, pattern: string = 'dd/MM/yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern, { locale: ptBR });
}
export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
}
export function formatRelative(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const days = differenceInDays(new Date(), d);
  if (days === 0) return 'Hoje';
  if (days === 1) return 'Ontem';
  if (days < 7) return `${days} dias atrás`;
  if (days < 30) return `${Math.floor(days / 7)} semanas atrás`;
  return formatDate(d);
}
export function calcularIdade(dataNascimento: string | Date): number {
  return differenceInYears(new Date(), typeof dataNascimento === 'string' ? parseISO(dataNascimento) : dataNascimento);
}
export function calcularTempoServico(dataAdmissao: string | Date): { anos: number; meses: number; dias: number } {
  const d = typeof dataAdmissao === 'string' ? parseISO(dataAdmissao) : dataAdmissao;
  const now = new Date();
  return { anos: differenceInYears(now, d), meses: differenceInMonths(now, d) % 12, dias: differenceInDays(now, d) % 30 };
}
