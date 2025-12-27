import { cn } from '@/lib/utils';
interface TruncateProps { text: string; maxLength?: number; className?: string; }
export function Truncate({ text, maxLength = 50, className }: TruncateProps) {
  const truncated = text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  return <span className={cn('block truncate', className)} title={text.length > maxLength ? text : undefined}>{truncated}</span>;
}
