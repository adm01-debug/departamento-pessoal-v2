import { cn } from '@/lib/utils';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface NotificationItemProps { title: string; message: string; time: string; read?: boolean; onDismiss?: () => void; onClick?: () => void; }
export function NotificationItem({ title, message, time, read = false, onDismiss, onClick }: NotificationItemProps) {
  return (<div className={cn('flex gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted/50', !read && 'bg-muted/30')} onClick={onClick}><Bell className="h-5 w-5 text-muted-foreground mt-0.5" /><div className="flex-1"><p className="text-sm font-medium">{title}</p><p className="text-xs text-muted-foreground line-clamp-2">{message}</p><p className="text-xs text-muted-foreground mt-1">{time}</p></div>{onDismiss && <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); onDismiss(); }}><X className="h-4 w-4" /></Button>}</div>);
}
