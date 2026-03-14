import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, Bell, Search, User, Settings, LogOut, Sparkles } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
  user?: { name: string; email: string; avatar?: string };
  className?: string;
}

export function Header({ onMenuClick, user, className }: HeaderProps) {
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'US';

  return (
    <header className={cn(
      'flex items-center justify-between h-16 px-4 lg:px-6',
      'border-b border-border/50 bg-card/80 backdrop-blur-xl',
      className
    )}>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden hover:bg-accent/50">
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2.5 px-4 py-2 bg-accent/50 rounded-xl border border-border/30 backdrop-blur-sm hover:border-primary/30 transition-colors group">
          <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent border-none outline-none text-sm w-52 font-body placeholder:text-muted-foreground/60"
          />
          <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border/50 bg-muted px-1.5 text-[10px] font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative hover:bg-accent/50 rounded-xl">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full ring-2 ring-card animate-pulse" />
        </Button>

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2.5 hover:bg-accent/50 rounded-xl px-2">
              <div className="relative">
                <Avatar className="h-8 w-8 ring-2 ring-border/50">
                  {user?.avatar && <AvatarImage src={user.avatar} />}
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-card" />
              </div>
              <span className="hidden md:inline text-sm font-medium font-body">{user?.name || 'Usuário'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 glass border-border/50">
            <DropdownMenuItem className="gap-2"><User className="h-4 w-4" />Perfil</DropdownMenuItem>
            <DropdownMenuItem className="gap-2"><Settings className="h-4 w-4" />Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" />Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
