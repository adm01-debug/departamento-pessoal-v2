import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AlertItemProps { avatar?: string; name: string; action: string; time: string; read?: boolean; onClick?: () => void; className?: string; }

export function AlertItem({ avatar, name, action, time, read, onClick, className }: AlertItemProps) {
  return (
    <div className={cn("flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted", !read && "bg-primary/5", className)} onClick={onClick}>
      <Avatar className="h-8 w-8"><AvatarImage src={avatar} /><AvatarFallback>{name[0]}</AvatarFallback></Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm"><span className="font-medium">{name}</span> {action}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
      {!read && <span className="h-2 w-2 rounded-full bg-primary mt-2" />}
    </div>
  );
}
export default AlertItem;
