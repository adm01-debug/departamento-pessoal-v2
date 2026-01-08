import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, CheckCheck, Trash2, Settings, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: Date;
  action?: { label: string; onClick: () => void };
}

interface NotificationCenterProps {
  notifications: Notification[];
  className?: string;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: string) => void;
  onClearAll?: () => void;
}

export function NotificationCenter({ notifications, className, onMarkAsRead, onMarkAllAsRead, onDelete, onClearAll }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "success": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "error": return "bg-red-500";
      default: return "bg-blue-500";
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <div className={cn("p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors", !notification.read && "bg-muted/30")}>
      <div className="flex gap-3">
        <div className={cn("w-2 h-2 rounded-full mt-2 flex-shrink-0", getTypeColor(notification.type))} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={cn("text-sm", !notification.read && "font-medium")}>{notification.title}</p>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{formatTimestamp(notification.timestamp)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
          {notification.action && (
            <Button variant="link" size="sm" className="h-auto p-0 mt-1" onClick={notification.action.onClick}>{notification.action.label}</Button>
          )}
        </div>
        <div className="flex flex-col gap-1">
          {!notification.read && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onMarkAsRead?.(notification.id)}><Check className="h-3 w-3" /></Button>
          )}
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => onDelete?.(notification.id)}><X className="h-3 w-3" /></Button>
        </div>
      </div>
    </div>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("relative", className)}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">{unreadCount > 99 ? "99+" : unreadCount}</Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h4 className="font-semibold">Notificações</h4>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}><CheckCheck className="h-4 w-4 mr-1" />Marcar todas</Button>
            )}
          </div>
        </div>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="unread">Não lidas {unreadCount > 0 && `(${unreadCount})`}</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="m-0">
            <ScrollArea className="h-[300px]">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <Bell className="h-8 w-8 mb-2" />
                  <p className="text-sm">Nenhuma notificação</p>
                </div>
              ) : notifications.map(n => <NotificationItem key={n.id} notification={n} />)}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="unread" className="m-0">
            <ScrollArea className="h-[300px]">
              {notifications.filter(n => !n.read).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <CheckCheck className="h-8 w-8 mb-2" />
                  <p className="text-sm">Tudo lido!</p>
                </div>
              ) : notifications.filter(n => !n.read).map(n => <NotificationItem key={n.id} notification={n} />)}
            </ScrollArea>
          </TabsContent>
        </Tabs>
        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={onClearAll}><Trash2 className="h-4 w-4 mr-1" />Limpar todas</Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
export default NotificationCenter;
