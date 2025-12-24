import { memo } from 'react';
import { cn } from '@/lib/utils';
interface NavMenuProps { children: React.ReactNode; className?: string; }
export const NavMenu = memo(function NavMenu({ children, className }: NavMenuProps) {
  return <nav className={cn('space-y-1', className)}>{children}</nav>;
});
