import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, Smartphone, MessageSquare } from "lucide-react";

interface NotificationChannel { id: string; name: string; icon: React.ReactNode; enabled: boolean; }
interface NotificationSettingsProps { channels: NotificationChannel[]; onToggle: (id: string, enabled: boolean) => void; className?: string; }

export function NotificationSettings({ channels, onToggle, className }: NotificationSettingsProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Bell className="h-5 w-5" />Notificações</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {channels.map((channel) => (
          <div key={channel.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">{channel.icon}</div>
              <span className="text-sm font-medium">{channel.name}</span>
            </div>
            <Switch checked={channel.enabled} onCheckedChange={(enabled) => onToggle(channel.id, enabled)} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
export default NotificationSettings;
