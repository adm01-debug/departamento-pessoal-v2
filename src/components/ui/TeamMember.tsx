import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Linkedin, Twitter, Mail } from "lucide-react";

interface TeamMemberProps {
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
  social?: { linkedin?: string; twitter?: string; email?: string };
  className?: string;
}

export function TeamMember({ name, role, avatar, bio, social, className }: TeamMemberProps) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <Card className={cn("text-center", className)}>
      <CardContent className="pt-6">
        <Avatar className="h-24 w-24 mx-auto">
          <AvatarImage src={avatar} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <h3 className="font-semibold mt-4">{name}</h3>
        <p className="text-sm text-muted-foreground">{role}</p>
        {bio && <p className="text-sm text-muted-foreground mt-2">{bio}</p>}
        {social && (
          <div className="flex justify-center gap-2 mt-4">
            {social.linkedin && <Button variant="ghost" size="icon" asChild><a href={social.linkedin} target="_blank" rel="noopener"><Linkedin className="h-4 w-4" /></a></Button>}
            {social.twitter && <Button variant="ghost" size="icon" asChild><a href={social.twitter} target="_blank" rel="noopener"><Twitter className="h-4 w-4" /></a></Button>}
            {social.email && <Button variant="ghost" size="icon" asChild><a href={`mailto:${social.email}`}><Mail className="h-4 w-4" /></a></Button>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export default TeamMember;
