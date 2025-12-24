/**
 * @fileoverview Header do portal do colaborador
 * @module components/portal/PortalHeader
 */
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, Settings, LogOut, User, HelpCircle } from 'lucide-react';

interface PortalHeaderProps {
  usuario: { nome: string; cargo: string; avatar?: string };
  notificacoes?: number;
  onPerfil: () => void;
  onConfiguracoes: () => void;
  onAjuda: () => void;
  onLogout: () => void;
}

export const PortalHeader = memo(function PortalHeader({
  usuario, notificacoes = 0, onPerfil, onConfiguracoes, onAjuda, onLogout
}: PortalHeaderProps) {
  const initials = usuario.nome.split(' ').map(n => n[0]).slice(0, 2).join('');

  return (
    <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Portal do Colaborador</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notificacoes > 0 && <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">{notificacoes}</span>}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8"><AvatarImage src={usuario.avatar} /><AvatarFallback>{initials}</AvatarFallback></Avatar>
                <div className="text-left hidden md:block"><p className="text-sm font-medium">{usuario.nome}</p><p className="text-xs text-muted-foreground">{usuario.cargo}</p></div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onPerfil}><User className="h-4 w-4 mr-2" />Meu Perfil</DropdownMenuItem>
              <DropdownMenuItem onClick={onConfiguracoes}><Settings className="h-4 w-4 mr-2" />Configurações</DropdownMenuItem>
              <DropdownMenuItem onClick={onAjuda}><HelpCircle className="h-4 w-4 mr-2" />Ajuda</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-red-600"><LogOut className="h-4 w-4 mr-2" />Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
});
