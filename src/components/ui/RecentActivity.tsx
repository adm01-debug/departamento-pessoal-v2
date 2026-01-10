import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FeedItem { user: { name: string; avatar?: string }; action: string; target?: string; time: string; }
interface RecentActivityProps { title?: string; items: FeedItem[]; className?: string; }

export function RecentActivity({ title = "Atividades Recentes", items, className }: RecentActivityProps) {
  return (
    <Card className={className}>
      <CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <Avatar className="h-8 w-8"><AvatarImage src={item.user.avatar} /><AvatarFallback>{item.user.name[0]}</AvatarFallback></Avatar>
            <div>
              <p className="text-sm"><span className="font-medium">{item.user.name}</span> {item.action} {item.target && <span className="font-medium">{item.target}</span>}</p>
              <p className="text-xs text-muted-foreground">{item.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
export default RecentActivity;
