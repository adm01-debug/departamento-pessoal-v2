import { cn } from '@/lib/utils';
interface FlexContainerProps { children: React.ReactNode; direction?: 'row' | 'col'; justify?: 'start' | 'center' | 'end' | 'between'; align?: 'start' | 'center' | 'end'; gap?: 'sm' | 'md' | 'lg'; wrap?: boolean; className?: string; }
export function FlexContainer({ children, direction = 'row', justify = 'start', align = 'center', gap = 'md', wrap = false, className }: FlexContainerProps) {
  return <div className={cn('flex', direction === 'col' ? 'flex-col' : 'flex-row', `justify-${justify}`, `items-${align}`, gap === 'sm' ? 'gap-2' : gap === 'md' ? 'gap-4' : 'gap-6', wrap && 'flex-wrap', className)}>{children}</div>;
}
