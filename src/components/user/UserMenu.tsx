import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, LogOut } from 'lucide-react';
interface UserMenuProps { name: string; email: string; avatar?: string; onProfile?: () => void; onSettings?: () => void; onLogout?: () => void; }
export function UserMenu({ name, email, avatar, onProfile, onSettings, onLogout }: UserMenuProps) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  return (<DropdownMenu><DropdownMenuTrigger className="focus:outline-none"><Avatar><AvatarImage src={avatar} /><AvatarFallback>{initials}</AvatarFallback></Avatar></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuLabel><div><p className="font-medium">{name}</p><p className="text-xs text-muted-foreground">{email}</p></div></DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem onClick={onProfile}><User className="mr-2 h-4 w-4" />Perfil</DropdownMenuItem><DropdownMenuItem onClick={onSettings}><Settings className="mr-2 h-4 w-4" />Configurações</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onClick={onLogout} className="text-destructive"><LogOut className="mr-2 h-4 w-4" />Sair</DropdownMenuItem></DropdownMenuContent></DropdownMenu>);
}
