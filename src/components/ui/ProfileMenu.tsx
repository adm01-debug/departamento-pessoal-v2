import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, HelpCircle } from "lucide-react";

interface ProfileMenuProps { user: { name: string; email: string; avatar?: string }; onProfile?: () => void; onSettings?: () => void; onHelp?: () => void; onLogout?: () => void; }

export function ProfileMenu({ user, onProfile, onSettings, onHelp, onLogout }: ProfileMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="h-8 w-8 cursor-pointer"><AvatarImage src={user.avatar} /><AvatarFallback>{user.name[0]}</AvatarFallback></Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel><p className="font-medium">{user.name}</p><p className="text-xs text-muted-foreground">{user.email}</p></DropdownMenuLabel>
        <DropdownMenuSeparator />
        {onProfile && <DropdownMenuItem onClick={onProfile}><User className="h-4 w-4 mr-2" />Meu Perfil</DropdownMenuItem>}
        {onSettings && <DropdownMenuItem onClick={onSettings}><Settings className="h-4 w-4 mr-2" />Configurações</DropdownMenuItem>}
        {onHelp && <DropdownMenuItem onClick={onHelp}><HelpCircle className="h-4 w-4 mr-2" />Ajuda</DropdownMenuItem>}
        <DropdownMenuSeparator />
        {onLogout && <DropdownMenuItem onClick={onLogout} className="text-red-600"><LogOut className="h-4 w-4 mr-2" />Sair</DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default ProfileMenu;
