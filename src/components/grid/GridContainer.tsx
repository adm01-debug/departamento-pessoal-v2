import { cn } from '@/lib/utils';
interface GridContainerProps { children: React.ReactNode; cols?: 1 | 2 | 3 | 4; gap?: 'sm' | 'md' | 'lg'; className?: string; }
const colsMap = { 1: 'grid-cols-1', 2: 'grid-cols-1 sm:grid-cols-2', 3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', 4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' };
const gapMap = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6' };
export function GridContainer({ children, cols = 3, gap = 'md', className }: GridContainerProps) {
  return <div className={cn('grid', colsMap[cols], gapMap[gap], className)}>{children}</div>;
}
