import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TeamMemberCardProps { name: string; role: string; avatar?: string; status?: "online" | "offline" | "busy"; className?: string; }

export function TeamMemberCard({ name, role, avatar, status, className }: TeamMemberCardProps) {
  const statusColors = { online: "bg-green-500", offline: "bg-gray-400", busy: "bg-red-500" };
  return (
    <div className={cn("flex items-center gap-3 p-3 border rounded-lg", className)}>
      <div className="relative">
        <Avatar><AvatarImage src={avatar} /><AvatarFallback>{name[0]}</AvatarFallback></Avatar>
        {status && <span className={cn("absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background", statusColors[status])} />}
      </div>
      <div><p className="font-medium">{name}</p><p className="text-sm text-muted-foreground">{role}</p></div>
    </div>
  );
}
export default TeamMemberCard;
