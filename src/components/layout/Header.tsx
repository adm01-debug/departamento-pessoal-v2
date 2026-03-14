import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, Search } from 'lucide-react';
import { NotificationCenter } from '@/components/ui/notification-center';
import { UserProfileMenu } from '@/components/ui/user-profile-menu';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Breadcrumbs } from './Breadcrumbs';

interface HeaderProps {
  onMenuClick?: () => void;
  user?: { name: string; email: string; avatar?: string };
  className?: string;
}

export function Header({ onMenuClick, user, className }: HeaderProps) {
  const handleSearchClick = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
  };

  return (
    <header className={cn(
      'flex items-center justify-between h-16 px-4 lg:px-6',
      'border-b border-border/50 bg-card/80 backdrop-blur-xl',
      className
    )}>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden hover:bg-accent/50 rounded-xl" aria-label="Abrir menu">
          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumbs */}
        <Breadcrumbs className="hidden md:flex" />

        {/* Search trigger */}
        <button
          onClick={handleSearchClick}
          className="hidden md:flex items-center gap-2.5 px-4 py-2 bg-accent/50 rounded-xl border border-border/30 backdrop-blur-sm hover:border-primary/30 hover:bg-accent/80 transition-all group cursor-pointer"
          aria-label="Buscar (⌘K)"
        >
          <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="text-body font-body text-muted-foreground/60 w-32 lg:w-52 text-left">Buscar...</span>
          <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border/50 bg-muted px-1.5 text-overline font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        <NotificationCenter />
        <UserProfileMenu user={user} />
      </div>
    </header>
  );
}
