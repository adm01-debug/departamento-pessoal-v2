import { memo } from 'react';
import { cn } from '@/lib/utils';
interface KpiGridProps { children: React.ReactNode; columns?: 2 | 3 | 4; className?: string; }
export const KpiGrid = memo(function KpiGrid({ children, columns = 4, className }: KpiGridProps) {
  const cols = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' };
  return <div className={cn('grid gap-4', cols[columns], className)}>{children}</div>;
});
