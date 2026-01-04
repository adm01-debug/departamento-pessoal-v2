import { format, parse, isValid, differenceInDays, differenceInMonths, differenceInYears, addDays, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
export function formatDate(date: Date | string, fmt = "dd/MM/yyyy"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return isValid(d) ? format(d, fmt, { locale: ptBR }) : "";
}
export function parseDate(dateStr: string, fmt = "dd/MM/yyyy"): Date | null {
  const d = parse(dateStr, fmt, new Date());
  return isValid(d) ? d : null;
}
export function calculateAge(birthDate: Date): number {
  return differenceInYears(new Date(), birthDate);
}
export function calculateWorkingDays(start: Date, end: Date): number {
  let count = 0;
  let current = start;
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current = addDays(current, 1);
  }
  return count;
}
export default { formatDate, parseDate, calculateAge, calculateWorkingDays };
