import { memo } from 'react';
import { cn } from '@/lib/utils';
interface SidebarProps { children: React.ReactNode; open?: boolean; className?: string; }
export const Sidebar = memo(function Sidebar({ children, open = true, className }: SidebarProps) {
  return (
    <aside className={cn('w-64 border-r bg-background h-full transition-all', !open && 'w-0 overflow-hidden', className)}>
      <div className="p-4 space-y-2">{children}</div>
    </aside>
  );
});
