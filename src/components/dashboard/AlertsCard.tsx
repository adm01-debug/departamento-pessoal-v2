import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Info, CheckCircle, X, Bell } from "lucide-react";

type AlertType = "error" | "warning" | "info" | "success";
interface Alert { id: string; type: AlertType; title: string; message?: string; timestamp: Date; read?: boolean; }
interface AlertsCardProps { alerts: Alert[]; onDismiss?: (id: string) => void; onDismissAll?: () => void; onMarkRead?: (id: string) => void; maxHeight?: number; className?: string; }

const icons = { error: AlertCircle, warning: AlertTriangle, info: Info, success: CheckCircle };
const colors = { error: "text-red-500 bg-red-50", warning: "text-yellow-500 bg-yellow-50", info: "text-blue-500 bg-blue-50", success: "text-green-500 bg-green-50" };

export function AlertsCard({ alerts, onDismiss, onDismissAll, onMarkRead, maxHeight = 300, className }: AlertsCardProps) {
  const unreadCount = alerts.filter(a => !a.read).length;
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" /><CardTitle className="text-base">Alertas</CardTitle>
          {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
        </div>
        {alerts.length > 0 && onDismissAll && <Button variant="ghost" size="sm" onClick={onDismissAll}>Limpar todos</Button>}
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">Nenhum alerta</p> : (
          <ScrollArea style={{ maxHeight }}>
            <div className="space-y-2">
              {alerts.map(alert => {
                const Icon = icons[alert.type];
                return (
                  <div key={alert.id} className={cn("flex items-start gap-3 p-3 rounded-lg", colors[alert.type], !alert.read && "border-l-4 border-current")} onClick={() => onMarkRead?.(alert.id)}>
                    <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{alert.title}</p>
                      {alert.message && <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>}
                      <p className="text-xs text-muted-foreground mt-1">{alert.timestamp.toLocaleTimeString()}</p>
                    </div>
                    {onDismiss && <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onDismiss(alert.id); }}><X className="h-3 w-3" /></Button>}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
export default AlertsCard;
