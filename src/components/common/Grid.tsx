import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
interface Props { children: ReactNode; cols?: 1|2|3|4|5|6; gap?: 'sm'|'md'|'lg'; className?: string; }
const colsMap = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5', 6: 'grid-cols-6' };
const gapMap = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6' };
export const Grid = memo(function Grid({ children, cols = 1, gap = 'md', className }: Props) {
  return <div className={cn('grid', colsMap[cols], gapMap[gap], className)}>{children}</div>;
});
