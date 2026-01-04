import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, RefreshCw, FileText } from "lucide-react";

interface ResumoEncargosProps { className?: string; data?: any[]; onExport?: (format: string) => void; onRefresh?: () => void; loading?: boolean; }

export function ResumoEncargos({ className, data = [], onExport, onRefresh, loading = false }: ResumoEncargosProps) {
  const [period, setPeriod] = useState("current");
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />ResumoEncargos</CardTitle><CardDescription>Relatório</CardDescription></div>
          <div className="flex gap-2">
            <Select value={period} onValueChange={setPeriod}><SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="current">Mês Atual</SelectItem><SelectItem value="last">Mês Anterior</SelectItem></SelectContent></Select>
            <Button variant="outline" size="icon" onClick={onRefresh} disabled={loading}><RefreshCw className="h-4 w-4" /></Button>
            <Button variant="outline" onClick={() => onExport?.("pdf")}><Download className="h-4 w-4 mr-2" />Exportar</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>{data.length > 0 ? <div>{data.length} registros</div> : <div className="text-center py-8 text-muted-foreground"><FileText className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>Nenhum dado disponível</p></div>}</CardContent>
    </Card>
  );
}
export default ResumoEncargos;
