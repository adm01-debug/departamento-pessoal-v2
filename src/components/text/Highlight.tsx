import { cn } from '@/lib/utils';
interface HighlightProps { text: string; query: string; className?: string; highlightClassName?: string; }
export function Highlight({ text, query, className, highlightClassName = 'bg-yellow-200 dark:bg-yellow-800' }: HighlightProps) {
  if (!query.trim()) return <span className={className}>{text}</span>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return <span className={className}>{parts.map((part, i) => regex.test(part) ? <mark key={i} className={cn('rounded px-0.5', highlightClassName)}>{part}</mark> : part)}</span>;
}
