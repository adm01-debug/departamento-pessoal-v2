import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface NotificationBellProps { count?: number; onClick?: () => void; className?: string; }

export function NotificationBell({ count = 0, onClick, className }: NotificationBellProps) {
  return (
    <Button variant="ghost" size="icon" className={cn("relative", className)} onClick={onClick}>
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Button>
  );
}
export default NotificationBell;
