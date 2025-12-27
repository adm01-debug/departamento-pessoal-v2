import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
interface MenuItemProps { to: string; icon: React.ReactNode; label: string; badge?: number; }
export function MenuItem({ to, icon, label, badge }: MenuItemProps) {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + '/');
  return (<Link to={to} className={cn('flex items-center gap-3 px-3 py-2 rounded-lg transition-colors', active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}><span className="flex-shrink-0">{icon}</span><span className="flex-1">{label}</span>{badge !== undefined && <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20">{badge}</span>}</Link>);
}
