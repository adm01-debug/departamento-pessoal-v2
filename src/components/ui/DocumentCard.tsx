import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Trash2, AlertTriangle } from "lucide-react";

interface DocumentCardProps { name: string; type: string; uploadedAt: string; expiresAt?: string; status?: "valido" | "vencido" | "pendente"; onView?: () => void; onDownload?: () => void; onDelete?: () => void; className?: string; }

export function DocumentCard({ name, type, uploadedAt, expiresAt, status = "valido", onView, onDownload, onDelete, className }: DocumentCardProps) {
  const statusConfig = { valido: { color: "bg-green-500", label: "Válido" }, vencido: { color: "bg-red-500", label: "Vencido" }, pendente: { color: "bg-yellow-500", label: "Pendente" } };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center"><FileText className="h-5 w-5 text-muted-foreground" /></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2"><h3 className="font-medium truncate">{name}</h3><Badge className={statusConfig[status].color}>{statusConfig[status].label}</Badge></div>
            <p className="text-sm text-muted-foreground">{type}</p>
            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
              <span>Enviado: {uploadedAt}</span>
              {expiresAt && <span className={status === "vencido" ? "text-red-500" : ""}>Vencimento: {expiresAt}</span>}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          {onView && <Button variant="ghost" size="sm" onClick={onView}><Eye className="h-4 w-4" /></Button>}
          {onDownload && <Button variant="ghost" size="sm" onClick={onDownload}><Download className="h-4 w-4" /></Button>}
          {onDelete && <Button variant="ghost" size="sm" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>}
        </div>
      </CardContent>
    </Card>
  );
}
export default DocumentCard;
