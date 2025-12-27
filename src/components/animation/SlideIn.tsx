import { cn } from '@/lib/utils';
interface SlideInProps { children: React.ReactNode; direction?: 'left' | 'right' | 'up' | 'down'; className?: string; }
const directions = { left: '-translate-x-full', right: 'translate-x-full', up: '-translate-y-full', down: 'translate-y-full' };
export function SlideIn({ children, direction = 'left', className }: SlideInProps) {
  return <div className={cn('animate-in slide-in-from-' + direction, className)}>{children}</div>;
}
