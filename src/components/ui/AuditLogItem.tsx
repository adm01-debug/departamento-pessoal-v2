import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AuditLogItemProps { user: { name: string; avatar?: string }; action: string; resource: string; resourceId?: string; timestamp: Date; ipAddress?: string; className?: string; }

const actionColors: Record<string, string> = { criar: "bg-green-500", editar: "bg-blue-500", excluir: "bg-red-500", visualizar: "bg-gray-500", login: "bg-purple-500", logout: "bg-orange-500" };

export function AuditLogItem({ user, action, resource, resourceId, timestamp, ipAddress, className }: AuditLogItemProps) {
  const actionLower = action.toLowerCase();
  const color = Object.keys(actionColors).find((k) => actionLower.includes(k)) ? actionColors[Object.keys(actionColors).find((k) => actionLower.includes(k))!] : "bg-gray-500";

  return (
    <div className={cn("flex items-start gap-3 p-3 border-b last:border-0", className)}>
      <Avatar className="h-8 w-8"><AvatarImage src={user.avatar} /><AvatarFallback>{user.name[0]}</AvatarFallback></Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm"><span className="font-medium">{user.name}</span> <Badge className={cn("ml-1", color)}>{action}</Badge> <span className="text-muted-foreground">{resource}</span>{resourceId && <span className="text-muted-foreground"> #{resourceId}</span>}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span>{formatDistanceToNow(timestamp, { addSuffix: true, locale: ptBR })}</span>
          {ipAddress && <span>IP: {ipAddress}</span>}
        </div>
      </div>
    </div>
  );
}
export default AuditLogItem;
