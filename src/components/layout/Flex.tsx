import { cn } from '@/lib/utils';
interface FlexProps { direction?: 'row' | 'col'; align?: 'start' | 'center' | 'end' | 'stretch'; justify?: 'start' | 'center' | 'end' | 'between' | 'around'; gap?: 1 | 2 | 3 | 4 | 6 | 8; wrap?: boolean; children: React.ReactNode; className?: string; }
export function Flex({ direction = 'row', align = 'stretch', justify = 'start', gap = 4, wrap = false, children, className }: FlexProps) {
  return <div className={cn('flex', `flex-${direction}`, `items-${align}`, `justify-${justify}`, `gap-${gap}`, wrap && 'flex-wrap', className)}>{children}</div>;
}
