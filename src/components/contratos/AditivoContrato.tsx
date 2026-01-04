import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from "lucide-react";

interface AditivoContratoProps { className?: string; data?: any; onGenerate?: () => void; onDownload?: () => void; }

export function AditivoContrato({ className, data, onGenerate, onDownload }: AditivoContratoProps) {
  return (
    <Card className={className}>
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />AditivoContrato</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{data ? "Documento disponível" : "Gere o documento"}</p>
        <div className="flex gap-2">
          <Button onClick={onGenerate}><Eye className="h-4 w-4 mr-2" />Gerar</Button>
          <Button variant="outline" onClick={onDownload} disabled={!data}><Download className="h-4 w-4 mr-2" />Baixar</Button>
        </div>
      </CardContent>
    </Card>
  );
}
export default AditivoContrato;
