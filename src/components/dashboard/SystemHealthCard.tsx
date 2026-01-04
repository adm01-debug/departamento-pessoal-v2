import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Server, Database, Wifi, HardDrive, Cpu, MemoryStick, Activity, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface SystemMetric { name: string; value: number; max: number; unit: string; status: "healthy" | "warning" | "critical"; icon: "server" | "database" | "network" | "storage" | "cpu" | "memory"; }
interface SystemHealthCardProps { metrics: SystemMetric[]; overallStatus?: "healthy" | "warning" | "critical"; lastCheck?: Date; className?: string; }

const icons = { server: Server, database: Database, network: Wifi, storage: HardDrive, cpu: Cpu, memory: MemoryStick };
const statusColors = { healthy: "text-green-600 bg-green-50", warning: "text-yellow-600 bg-yellow-50", critical: "text-red-600 bg-red-50" };
const statusIcons = { healthy: CheckCircle, warning: AlertTriangle, critical: XCircle };

export function SystemHealthCard({ metrics, overallStatus = "healthy", lastCheck, className }: SystemHealthCardProps) {
  const StatusIcon = statusIcons[overallStatus];
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4" />Saúde do Sistema</CardTitle>
          <Badge className={cn(statusColors[overallStatus])}><StatusIcon className="h-3 w-3 mr-1" />{overallStatus === "healthy" ? "Saudável" : overallStatus === "warning" ? "Atenção" : "Crítico"}</Badge>
        </div>
        {lastCheck && <p className="text-xs text-muted-foreground">Última verificação: {lastCheck.toLocaleTimeString()}</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, i) => {
            const Icon = icons[metric.icon];
            const percentage = (metric.value / metric.max) * 100;
            return (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><Icon className="h-4 w-4 text-muted-foreground" /><span>{metric.name}</span></div>
                  <span className={cn("font-medium", statusColors[metric.status].split(" ")[0])}>{metric.value}{metric.unit} / {metric.max}{metric.unit}</span>
                </div>
                <Progress value={percentage} className={cn("h-2", metric.status === "critical" && "[&>div]:bg-red-500", metric.status === "warning" && "[&>div]:bg-yellow-500")} />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
export default SystemHealthCard;
