import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Settings, RefreshCw, CheckCircle, XCircle } from "lucide-react";

interface IntegrationCardProps { name: string; description?: string; icon?: React.ReactNode; status: "connected" | "disconnected" | "error"; lastSync?: string; enabled?: boolean; onToggle?: (enabled: boolean) => void; onSync?: () => void; onConfigure?: () => void; className?: string; }

export function IntegrationCard({ name, description, icon, status, lastSync, enabled = true, onToggle, onSync, onConfigure, className }: IntegrationCardProps) {
  const statusConfig = { connected: { color: "bg-green-500", icon: CheckCircle, label: "Conectado" }, disconnected: { color: "bg-gray-400", icon: XCircle, label: "Desconectado" }, error: { color: "bg-red-500", icon: XCircle, label: "Erro" } };
  const StatusIcon = statusConfig[status].icon;

  return (
    <Card className={cn(!enabled && "opacity-60", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">{icon || <Settings className="h-6 w-6" />}</div>
            <div>
              <div className="flex items-center gap-2"><h3 className="font-medium">{name}</h3><Badge className={statusConfig[status].color}><StatusIcon className="h-3 w-3 mr-1" />{statusConfig[status].label}</Badge></div>
              {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
              {lastSync && <p className="text-xs text-muted-foreground mt-1">Última sincronização: {lastSync}</p>}
            </div>
          </div>
          {onToggle && <Switch checked={enabled} onCheckedChange={onToggle} />}
        </div>
        <div className="flex gap-2 mt-4">
          {onSync && <Button variant="outline" size="sm" onClick={onSync} disabled={!enabled}><RefreshCw className="h-4 w-4 mr-1" />Sincronizar</Button>}
          {onConfigure && <Button variant="ghost" size="sm" onClick={onConfigure}><Settings className="h-4 w-4 mr-1" />Configurar</Button>}
        </div>
      </CardContent>
    </Card>
  );
}
export default IntegrationCard;
