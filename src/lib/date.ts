// V17.2-LIB003: Date Library Config
import { format, parseISO, addDays, addMonths, differenceInDays, differenceInMonths, differenceInYears, startOfMonth, endOfMonth, isWeekend, isBefore, isAfter, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
export { format, parseISO, addDays, addMonths, differenceInDays, differenceInMonths, differenceInYears, startOfMonth, endOfMonth, isWeekend, isBefore, isAfter, isValid };
export const formatBR = (date: Date | string, formatStr: string = 'dd/MM/yyyy') => format(typeof date === 'string' ? parseISO(date) : date, formatStr, { locale: ptBR });
export const formatCompetencia = (date: Date | string) => format(typeof date === 'string' ? parseISO(date) : date, 'MMMM/yyyy', { locale: ptBR });
export const toISODate = (date: Date) => format(date, 'yyyy-MM-dd');
export const competenciaAtual = () => format(new Date(), 'yyyy-MM');
