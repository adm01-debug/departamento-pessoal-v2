import { memo } from 'react';
import { cn } from '@/lib/utils';
interface NavItemProps { label: string; icon?: React.ReactNode; active?: boolean; onClick?: () => void; badge?: number; }
export const NavItem = memo(function NavItem({ label, icon, active, onClick, badge }: NavItemProps) {
  return (
    <button onClick={onClick} className={cn('flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg', active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>
      <span className="flex items-center gap-2">{icon}{label}</span>
      {badge !== undefined && badge > 0 && <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">{badge}</span>}
    </button>
  );
});
