import React from "react";
import { cn } from "@/lib/utils";
import { HoverCard as HoverCardPrimitive, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Mail, Phone, MapPin } from "lucide-react";

interface UserHoverCardProps {
  trigger: React.ReactNode;
  user: {
    name: string;
    email?: string;
    phone?: string;
    avatar?: string;
    role?: string;
    department?: string;
    location?: string;
    joinedAt?: string;
  };
  className?: string;
}

export function UserHoverCard({ trigger, user, className }: UserHoverCardProps) {
  const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <HoverCardPrimitive>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
      <HoverCardContent className={cn("w-80", className)}>
        <div className="flex gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="font-semibold">{user.name}</h4>
            {user.role && <p className="text-sm text-muted-foreground">{user.role}</p>}
            {user.department && <p className="text-xs text-muted-foreground">{user.department}</p>}
          </div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          {user.email && <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" />{user.email}</div>}
          {user.phone && <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" />{user.phone}</div>}
          {user.location && <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" />{user.location}</div>}
          {user.joinedAt && <div className="flex items-center gap-2 text-muted-foreground"><CalendarDays className="h-4 w-4" />Desde {user.joinedAt}</div>}
        </div>
      </HoverCardContent>
    </HoverCardPrimitive>
  );
}
export default UserHoverCard;
