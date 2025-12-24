import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
interface NavBadgeProps { count: number; variant?: 'default' | 'destructive'; max?: number; className?: string; }
export const NavBadge = memo(function NavBadge({ count, variant = 'default', max = 99, className }: NavBadgeProps) {
  if (count <= 0) return null;
  const display = count > max ? `${max}+` : String(count);
  return <Badge variant={variant} className={cn('h-5 min-w-[20px] px-1.5 text-xs', className)}>{display}</Badge>;
});
