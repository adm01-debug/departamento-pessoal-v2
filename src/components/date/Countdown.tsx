import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
interface CountdownProps { targetDate: Date | string; className?: string; }
export function Countdown({ targetDate, className }: CountdownProps) {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const now = new Date();
  const days = differenceInDays(target, now);
  const hours = differenceInHours(target, now) % 24;
  const mins = differenceInMinutes(target, now) % 60;
  if (days < 0) return <span className={className}>Expirado</span>;
  return <span className={className}>{days}d {hours}h {mins}m</span>;
}
