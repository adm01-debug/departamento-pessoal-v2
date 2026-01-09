import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HistoryItemProps { user: { name: string; avatar?: string }; action: string; target?: string; timestamp: Date; details?: string; className?: string; }

export function HistoryItem({ user, action, target, timestamp, details, className }: HistoryItemProps) {
  return (
    <div className={cn("flex gap-3", className)}>
      <Avatar className="h-8 w-8"><AvatarImage src={user.avatar} /><AvatarFallback>{user.name[0]}</AvatarFallback></Avatar>
      <div className="flex-1">
        <p className="text-sm"><span className="font-medium">{user.name}</span> {action}{target && <span className="font-medium"> {target}</span>}</p>
        {details && <p className="text-sm text-muted-foreground mt-1">{details}</p>}
        <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(timestamp, { addSuffix: true, locale: ptBR })}</p>
      </div>
    </div>
  );
}
export default HistoryItem;
