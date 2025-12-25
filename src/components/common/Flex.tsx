import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
interface Props { children: ReactNode; direction?: 'row'|'col'; justify?: 'start'|'center'|'end'|'between'; align?: 'start'|'center'|'end'; gap?: 'sm'|'md'|'lg'; wrap?: boolean; className?: string; }
const justifyMap = { start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between' };
const alignMap = { start: 'items-start', center: 'items-center', end: 'items-end' };
const gapMap = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6' };
export const Flex = memo(function Flex({ children, direction = 'row', justify = 'start', align = 'center', gap = 'md', wrap, className }: Props) {
  return <div className={cn('flex', direction === 'col' && 'flex-col', justifyMap[justify], alignMap[align], gapMap[gap], wrap && 'flex-wrap', className)}>{children}</div>;
});
