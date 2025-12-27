import { cn } from '@/lib/utils';
interface StackProps { children: React.ReactNode; direction?: 'row' | 'col'; gap?: 1 | 2 | 3 | 4 | 6 | 8; align?: 'start' | 'center' | 'end' | 'stretch'; justify?: 'start' | 'center' | 'end' | 'between' | 'around'; className?: string; }
export function Stack({ children, direction = 'col', gap = 4, align = 'stretch', justify = 'start', className }: StackProps) {
  return <div className={cn('flex', direction === 'row' ? 'flex-row' : 'flex-col', `gap-${gap}`, `items-${align}`, `justify-${justify}`, className)}>{children}</div>;
}
