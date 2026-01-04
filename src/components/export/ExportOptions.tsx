import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ExportOptionsProps { options: { includeHeaders: boolean; dateFormat: string; delimiter: string; encoding: string }; onChange: (options: any) => void; className?: string; }

export function ExportOptions({ options, onChange, className }: ExportOptionsProps) {
  const update = (key: string, value: any) => onChange({ ...options, [key]: value });
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3"><CardTitle className="text-base">Opções de Exportação</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between"><Label htmlFor="headers">Incluir cabeçalhos</Label><Switch id="headers" checked={options.includeHeaders} onCheckedChange={v => update("includeHeaders", v)} /></div>
        <div className="space-y-2"><Label>Formato de data</Label><Select value={options.dateFormat} onValueChange={v => update("dateFormat", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem><SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem><SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem></SelectContent></Select></div>
        <div className="space-y-2"><Label>Delimitador (CSV)</Label><Select value={options.delimiter} onValueChange={v => update("delimiter", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value=",">Vírgula (,)</SelectItem><SelectItem value=";">Ponto e vírgula (;)</SelectItem><SelectItem value="\t">Tab</SelectItem></SelectContent></Select></div>
        <div className="space-y-2"><Label>Codificação</Label><Select value={options.encoding} onValueChange={v => update("encoding", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="UTF-8">UTF-8</SelectItem><SelectItem value="ISO-8859-1">ISO-8859-1</SelectItem><SelectItem value="Windows-1252">Windows-1252</SelectItem></SelectContent></Select></div>
      </CardContent>
    </Card>
  );
}
export default ExportOptions;
