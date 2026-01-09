import React from "react";
import { cn } from "@/lib/utils";
import { Wifi, WifiOff, Signal } from "lucide-react";

interface ConnectionStatusProps { online: boolean; showLabel?: boolean; className?: string; }

export function ConnectionStatus({ online, showLabel = true, className }: ConnectionStatusProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {online ? (
        <>
          <Wifi className="h-4 w-4 text-green-500" />
          {showLabel && <span className="text-sm text-green-600">Conectado</span>}
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-red-500" />
          {showLabel && <span className="text-sm text-red-600">Desconectado</span>}
        </>
      )}
    </div>
  );
}
export default ConnectionStatus;
