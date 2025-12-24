import { memo } from 'react';
import { cn } from '@/lib/utils';
interface NavItemProps { label: string; icon?: React.ReactNode; active?: boolean; onClick?: () => void; badge?: React.ReactNode; }
export const NavItem = memo(function NavItem({ label, icon, active, onClick, badge }: NavItemProps) {
  return (
    <button onClick={onClick} className={cn('flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-colors', active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>
      <span className="flex items-center gap-3">{icon}{label}</span>{badge}
    </button>
  );
});
