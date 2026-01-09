import React from "react";
import { cn } from "@/lib/utils";
import { Cloud, CloudOff, RefreshCw, Check } from "lucide-react";

type SyncStatusType = "synced" | "syncing" | "offline" | "error";
interface SyncStatusProps { status: SyncStatusType; lastSync?: string; className?: string; }

export function SyncStatus({ status, lastSync, className }: SyncStatusProps) {
  const config = {
    synced: { icon: Check, color: "text-green-500", label: "Sincronizado" },
    syncing: { icon: RefreshCw, color: "text-blue-500", label: "Sincronizando..." },
    offline: { icon: CloudOff, color: "text-gray-500", label: "Offline" },
    error: { icon: Cloud, color: "text-red-500", label: "Erro de sincronização" },
  };
  const { icon: Icon, color, label } = config[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Icon className={cn("h-4 w-4", color, status === "syncing" && "animate-spin")} />
      <div>
        <p className={cn("text-sm", color)}>{label}</p>
        {lastSync && status === "synced" && <p className="text-xs text-muted-foreground">Última: {lastSync}</p>}
      </div>
    </div>
  );
}
export default SyncStatus;
