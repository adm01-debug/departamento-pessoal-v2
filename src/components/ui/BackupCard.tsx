import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Download, RefreshCw, Calendar, HardDrive } from "lucide-react";

interface BackupCardProps { name: string; createdAt: string; size: string; status: "completed" | "in_progress" | "failed"; type: "manual" | "automatic"; onDownload?: () => void; onRestore?: () => void; className?: string; }

export function BackupCard({ name, createdAt, size, status, type, onDownload, onRestore, className }: BackupCardProps) {
  const statusConfig = { completed: { color: "bg-green-500", label: "Concluído" }, in_progress: { color: "bg-blue-500", label: "Em Progresso" }, failed: { color: "bg-red-500", label: "Falhou" } };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2"><Database className="h-5 w-5 text-primary" /><CardTitle className="text-base">{name}</CardTitle></div>
        <div className="flex gap-2"><Badge variant="outline">{type}</Badge><Badge className={statusConfig[status].color}>{statusConfig[status].label}</Badge></div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{createdAt}</span>
          <span className="flex items-center gap-1"><HardDrive className="h-4 w-4" />{size}</span>
        </div>
        <div className="flex gap-2">
          {onDownload && status === "completed" && <Button variant="outline" size="sm" onClick={onDownload}><Download className="h-4 w-4 mr-1" />Download</Button>}
          {onRestore && status === "completed" && <Button variant="outline" size="sm" onClick={onRestore}><RefreshCw className="h-4 w-4 mr-1" />Restaurar</Button>}
        </div>
      </CardContent>
    </Card>
  );
}
export default BackupCard;
