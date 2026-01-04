import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Activity, ChevronRight, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ActivityItem { id: string; user?: { name: string; avatar?: string }; action: string; target?: string; timestamp: Date; type?: "create" | "update" | "delete" | "info"; }
interface RecentActivitiesCardProps { activities: ActivityItem[]; title?: string; maxItems?: number; maxHeight?: number; onViewAll?: () => void; className?: string; }

const typeColors = { create: "bg-green-100 text-green-700", update: "bg-blue-100 text-blue-700", delete: "bg-red-100 text-red-700", info: "bg-gray-100 text-gray-700" };

export function RecentActivitiesCard({ activities, title = "Atividades Recentes", maxItems = 10, maxHeight = 350, onViewAll, className }: RecentActivitiesCardProps) {
  const displayed = activities.slice(0, maxItems);
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div><CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4" />{title}</CardTitle><CardDescription>{activities.length} atividades</CardDescription></div>
        {onViewAll && <Button variant="ghost" size="sm" onClick={onViewAll}>Ver todas<ChevronRight className="h-4 w-4 ml-1" /></Button>}
      </CardHeader>
      <CardContent>
        {displayed.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">Nenhuma atividade recente</p> : (
          <ScrollArea style={{ maxHeight }}>
            <div className="space-y-4">
              {displayed.map(activity => (
                <div key={activity.id} className="flex items-start gap-3">
                  {activity.user ? (
                    <Avatar className="h-8 w-8"><AvatarImage src={activity.user.avatar} /><AvatarFallback>{activity.user.name.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                  ) : <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center"><Activity className="h-4 w-4" /></div>}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      {activity.user && <span className="font-medium">{activity.user.name} </span>}
                      <span className="text-muted-foreground">{activity.action}</span>
                      {activity.target && <span className="font-medium"> {activity.target}</span>}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: ptBR })}</span>
                      {activity.type && <Badge variant="secondary" className={cn("text-xs", typeColors[activity.type])}>{activity.type}</Badge>}
                    </div>
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
export default RecentActivitiesCard;
