import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, Download, Eye } from "lucide-react";

interface ReciboRescisaoGeneratorProps { className?: string; data?: any; onAction?: (action: string, data?: any) => void; loading?: boolean; }

export function ReciboRescisaoGenerator({ className, data, onAction, loading }: ReciboRescisaoGeneratorProps) {
  if (loading) return <Card className={cn("animate-pulse", className)}><CardContent className="p-6"><div className="h-32 bg-muted rounded" /></CardContent></Card>;
  
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />ReciboRescisaoGenerator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">{data ? "Documento disponível" : "Nenhum documento"}</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onAction?.("view", data)}><Eye className="h-4 w-4 mr-2" />Visualizar</Button>
          <Button variant="outline" size="sm" onClick={() => onAction?.("download", data)}><Download className="h-4 w-4 mr-2" />Baixar</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ReciboRescisaoGenerator;
