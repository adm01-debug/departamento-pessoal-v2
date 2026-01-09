import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface UserListItemProps { name: string; email?: string; avatar?: string; role?: string; status?: "online" | "offline" | "away"; onClick?: () => void; showArrow?: boolean; className?: string; }

export function UserListItem({ name, email, avatar, role, status, onClick, showArrow = false, className }: UserListItemProps) {
  const statusColors = { online: "bg-green-500", offline: "bg-gray-400", away: "bg-yellow-500" };
  return (
    <div className={cn("flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors", onClick && "cursor-pointer", className)} onClick={onClick}>
      <div className="relative">
        <Avatar><AvatarImage src={avatar} /><AvatarFallback>{name[0]}</AvatarFallback></Avatar>
        {status && <span className={cn("absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background", statusColors[status])} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{name}</p>
        {email && <p className="text-sm text-muted-foreground truncate">{email}</p>}
      </div>
      {role && <Badge variant="secondary">{role}</Badge>}
      {showArrow && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
    </div>
  );
}
export default UserListItem;
