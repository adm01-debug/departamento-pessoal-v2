import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Bell, User } from 'lucide-react';
interface HeaderProps { onMenuClick?: () => void; title?: string; }
export const Header = memo(function Header({ onMenuClick, title = 'Sistema RH' }: HeaderProps) {
  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick}><Menu className="h-5 w-5" /></Button>
        <h1 className="font-semibold text-lg">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
        <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
      </div>
    </header>
  );
});
