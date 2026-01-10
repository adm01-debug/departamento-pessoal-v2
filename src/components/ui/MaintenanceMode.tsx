import React from "react";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";

interface MaintenanceModeProps { title?: string; message?: string; className?: string; }

export function MaintenanceMode({ title = "Em Manutenção", message = "Estamos realizando melhorias.", className }: MaintenanceModeProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen text-center p-4", className)}>
      <Settings className="h-16 w-16 text-muted-foreground mb-4 animate-spin" />
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground max-w-md">{message}</p>
    </div>
  );
}
export default MaintenanceMode;
