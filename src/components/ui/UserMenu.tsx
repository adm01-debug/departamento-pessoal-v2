import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Settings, HelpCircle, LogOut, CreditCard, Bell, Shield } from "lucide-react";

interface UserInfo {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  destructive?: boolean;
}

interface UserMenuProps {
  user: UserInfo;
  className?: string;
  menuItems?: MenuItem[];
  onLogout?: () => void;
  showNotifications?: boolean;
  notificationCount?: number;
}

export function UserMenu({ user, className, menuItems, onLogout, showNotifications = false, notificationCount = 0 }: UserMenuProps) {
  const defaultMenuItems: MenuItem[] = [
    { label: "Meu Perfil", icon: <User className="h-4 w-4" />, onClick: () => {} },
    { label: "Configurações", icon: <Settings className="h-4 w-4" />, onClick: () => {} },
    { label: "Assinatura", icon: <CreditCard className="h-4 w-4" />, onClick: () => {} },
    { label: "Segurança", icon: <Shield className="h-4 w-4" />, onClick: () => {} },
    { label: "Ajuda", icon: <HelpCircle className="h-4 w-4" />, onClick: () => {} },
  ];

  const items = menuItems || defaultMenuItems;
  const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn("relative h-10 gap-2 px-2", className)}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium">{user.name}</span>
            {user.role && <span className="text-xs text-muted-foreground">{user.role}</span>}
          </div>
          {showNotifications && notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">{notificationCount > 99 ? "99+" : notificationCount}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {items.map((item, index) => (
            <DropdownMenuItem key={index} onClick={item.onClick} className={cn(item.destructive && "text-destructive")}>
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        {onLogout && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-destructive">
              <LogOut className="h-4 w-4" />
              <span className="ml-2">Sair</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default UserMenu;
