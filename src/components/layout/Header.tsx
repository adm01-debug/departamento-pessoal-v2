// V15-194: src/components/layout/Header.tsx
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, Bell, Search, User, Settings, LogOut } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
  user?: { name: string; email: string; avatar?: string };
  className?: string;
}

export function Header({ onMenuClick, user, className }: HeaderProps) {
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'US';

  return (
    <header className={cn('flex items-center justify-between h-16 px-4 border-b bg-card', className)}>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Buscar..." className="bg-transparent border-none outline-none text-sm w-48" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="h-8 w-8">
                {user?.avatar && <AvatarImage src={user.avatar} />}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm">{user?.name || 'Usuário'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem><User className="h-4 w-4 mr-2" />Perfil</DropdownMenuItem>
            <DropdownMenuItem><Settings className="h-4 w-4 mr-2" />Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600"><LogOut className="h-4 w-4 mr-2" />Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
