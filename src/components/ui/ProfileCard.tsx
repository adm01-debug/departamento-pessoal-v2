import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin } from "lucide-react";

interface ProfileCardProps {
  name: string;
  role?: string;
  department?: string;
  email?: string;
  phone?: string;
  location?: string;
  avatar?: string;
  status?: "active" | "inactive" | "away";
  actions?: React.ReactNode;
  className?: string;
}

export function ProfileCard({ name, role, department, email, phone, location, avatar, status, actions, className }: ProfileCardProps) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2);
  const statusColors = { active: "bg-green-500", inactive: "bg-gray-400", away: "bg-yellow-500" };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/10" />
      <CardContent className="pt-0 -mt-12">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={avatar} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            {status && <span className={cn("absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-background", statusColors[status])} />}
          </div>
          <h3 className="mt-3 text-lg font-semibold">{name}</h3>
          {role && <p className="text-sm text-muted-foreground">{role}</p>}
          {department && <Badge variant="secondary" className="mt-1">{department}</Badge>}
          <div className="mt-4 space-y-2 text-sm text-muted-foreground w-full">
            {email && <div className="flex items-center justify-center gap-2"><Mail className="h-4 w-4" />{email}</div>}
            {phone && <div className="flex items-center justify-center gap-2"><Phone className="h-4 w-4" />{phone}</div>}
            {location && <div className="flex items-center justify-center gap-2"><MapPin className="h-4 w-4" />{location}</div>}
          </div>
          {actions && <div className="mt-4 flex gap-2 w-full">{actions}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
export default ProfileCard;
