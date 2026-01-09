import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Activity {
  id: string;
  user: { name: string; avatar?: string };
  action: string;
  target?: string;
  timestamp: Date;
  icon?: React.ReactNode;
}

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
  showAvatars?: boolean;
  className?: string;
}

export function ActivityFeed({ activities, maxItems, showAvatars = true, className }: ActivityFeedProps) {
  const items = maxItems ? activities.slice(0, maxItems) : activities;

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((activity) => (
        <div key={activity.id} className="flex gap-3">
          {showAvatars && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.user.avatar} />
              <AvatarFallback>{activity.user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</AvatarFallback>
            </Avatar>
          )}
          {!showAvatars && activity.icon && <div className="flex-shrink-0 text-muted-foreground">{activity.icon}</div>}
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              <span className="font-medium">{activity.user.name}</span>
              {" "}{activity.action}
              {activity.target && <span className="font-medium"> {activity.target}</span>}
            </p>
            <p className="text-xs text-muted-foreground">{formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: ptBR })}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
export default ActivityFeed;
