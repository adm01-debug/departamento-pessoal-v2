import { memo } from 'react';
import { cn } from '@/lib/utils';
interface Props { className?: string; orientation?: 'horizontal'|'vertical'; }
export const Divider = memo(function Divider({ className, orientation = 'horizontal' }: Props) {
  return <div className={cn(orientation === 'horizontal' ? 'h-px w-full bg-border' : 'w-px h-full bg-border', className)} />;
});
