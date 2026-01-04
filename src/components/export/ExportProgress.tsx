import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download, Loader2, Check, X, AlertCircle } from "lucide-react";

interface ExportProgressProps { status: "idle" | "preparing" | "exporting" | "completed" | "error"; progress: number; fileName?: string; error?: string; onCancel?: () => void; onDownload?: () => void; onRetry?: () => void; className?: string; }

export function ExportProgress({ status, progress, fileName, error, onCancel, onDownload, onRetry, className }: ExportProgressProps) {
  const statusConfig = {
    idle: { icon: Download, color: "text-muted-foreground", label: "Pronto para exportar" },
    preparing: { icon: Loader2, color: "text-blue-500", label: "Preparando..." },
    exporting: { icon: Loader2, color: "text-blue-500", label: "Exportando..." },
    completed: { icon: Check, color: "text-green-500", label: "Concluído!" },
    error: { icon: AlertCircle, color: "text-red-500", label: "Erro na exportação" },
  };
  const { icon: Icon, color, label } = statusConfig[status];
  const isLoading = status === "preparing" || status === "exporting";

  return (
    <Card className={cn("", className)}>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className={cn("p-3 rounded-full bg-muted", color)}><Icon className={cn("h-6 w-6", isLoading && "animate-spin")} /></div>
          <div className="flex-1">
            <p className="font-medium">{label}</p>
            {fileName && status === "completed" && <p className="text-sm text-muted-foreground">{fileName}</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
            {isLoading && <Progress value={progress} className="h-2 mt-2" />}
          </div>
          <div className="flex gap-2">
            {isLoading && onCancel && <Button variant="outline" size="sm" onClick={onCancel}><X className="h-4 w-4 mr-1" />Cancelar</Button>}
            {status === "completed" && onDownload && <Button size="sm" onClick={onDownload}><Download className="h-4 w-4 mr-1" />Baixar</Button>}
            {status === "error" && onRetry && <Button variant="outline" size="sm" onClick={onRetry}>Tentar novamente</Button>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default ExportProgress;
