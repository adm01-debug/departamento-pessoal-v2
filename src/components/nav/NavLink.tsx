import { memo } from 'react';
import { cn } from '@/lib/utils';
interface NavLinkProps { href: string; label: string; icon?: React.ReactNode; active?: boolean; external?: boolean; }
export const NavLink = memo(function NavLink({ href, label, icon, active, external }: NavLinkProps) {
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className={cn('flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors', active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>
      {icon}{label}
    </a>
  );
});
