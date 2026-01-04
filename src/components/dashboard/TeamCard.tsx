import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Users, Mail, Phone, MoreVertical } from "lucide-react";

interface TeamMember { id: string; name: string; role: string; avatar?: string; status?: "online" | "offline" | "away"; email?: string; phone?: string; }
interface TeamCardProps { members: TeamMember[]; title?: string; maxHeight?: number; onMemberClick?: (id: string) => void; className?: string; }

const statusColors = { online: "bg-green-500", offline: "bg-gray-400", away: "bg-yellow-500" };

export function TeamCard({ members, title = "Equipe", maxHeight = 350, onMemberClick, className }: TeamCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" />{title}<Badge variant="secondary">{members.length}</Badge></CardTitle></CardHeader>
      <CardContent>
        {members.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">Nenhum membro</p> : (
          <ScrollArea style={{ maxHeight }}>
            <div className="space-y-3">
              {members.map(member => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => onMemberClick?.(member.id)}>
                  <div className="relative">
                    <Avatar><AvatarImage src={member.avatar} /><AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                    {member.status && <span className={cn("absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background", statusColors[member.status])} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {member.email && <Button variant="ghost" size="icon" className="h-7 w-7"><Mail className="h-3 w-3" /></Button>}
                    {member.phone && <Button variant="ghost" size="icon" className="h-7 w-7"><Phone className="h-3 w-3" /></Button>}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
export default TeamCard;
