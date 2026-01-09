import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";

interface NotificationDrawerProps { open: boolean; onOpenChange: (open: boolean) => void; onMarkAllRead?: () => void; children: React.ReactNode; }

export function NotificationDrawer({ open, onOpenChange, onMarkAllRead, children }: NotificationDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2"><Bell className="h-4 w-4" />Notificações</SheetTitle>
            {onMarkAllRead && <Button variant="ghost" size="sm" onClick={onMarkAllRead}><Check className="h-4 w-4 mr-1" />Marcar todas como lidas</Button>}
          </div>
        </SheetHeader>
        <div className="py-4 space-y-2 max-h-[calc(100vh-100px)] overflow-y-auto">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
export default NotificationDrawer;
