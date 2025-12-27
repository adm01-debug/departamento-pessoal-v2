import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
interface NotificationButtonProps { count?: number; onClick?: () => void; className?: string; }
export function NotificationButton({ count = 0, onClick, className }: NotificationButtonProps) {
  return (<Button variant="ghost" size="icon" onClick={onClick} className={cn('relative', className)}><Bell className="h-5 w-5" />{count > 0 && <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">{count > 99 ? '99+' : count}</span>}</Button>);
}
