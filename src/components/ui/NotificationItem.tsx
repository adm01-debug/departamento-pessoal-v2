import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NotificationItemProps { title: string; message: string; timestamp: Date; read?: boolean; avatar?: string; onClick?: () => void; className?: string; }

export function NotificationItem({ title, message, timestamp, read = false, avatar, onClick, className }: NotificationItemProps) {
  return (
    <div className={cn("flex gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors", !read && "bg-primary/5", className)} onClick={onClick}>
      <Avatar className="h-10 w-10"><AvatarImage src={avatar} /><AvatarFallback>{title[0]}</AvatarFallback></Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between"><p className={cn("font-medium text-sm", !read && "text-primary")}>{title}</p>{!read && <span className="h-2 w-2 rounded-full bg-primary" />}</div>
        <p className="text-sm text-muted-foreground truncate">{message}</p>
        <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(timestamp, { addSuffix: true, locale: ptBR })}</p>
      </div>
    </div>
  );
}
export default NotificationItem;
