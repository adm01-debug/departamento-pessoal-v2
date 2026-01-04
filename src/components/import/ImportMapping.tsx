import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowRight, AlertCircle, Check } from "lucide-react";

interface TargetField { key: string; label: string; required?: boolean; }
interface ImportMappingProps { sourceColumns: string[]; targetFields: TargetField[]; mapping: Record<string, string>; onChange: (mapping: Record<string, string>) => void; className?: string; }

export function ImportMapping({ sourceColumns, targetFields, mapping, onChange, className }: ImportMappingProps) {
  const handleChange = (targetKey: string, sourceColumn: string) => onChange({ ...mapping, [targetKey]: sourceColumn });
  const mappedCount = Object.values(mapping).filter(v => v && v !== "").length;
  const requiredFields = targetFields.filter(f => f.required);
  const requiredMapped = requiredFields.filter(f => mapping[f.key] && mapping[f.key] !== "").length;
  const isValid = requiredMapped === requiredFields.length;

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div><CardTitle className="text-base">Mapeamento de Colunas</CardTitle><CardDescription>{mappedCount} de {targetFields.length} campos mapeados</CardDescription></div>
          <Badge variant={isValid ? "default" : "destructive"}>{isValid ? <Check className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}{isValid ? "Válido" : "Incompleto"}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {targetFields.map(field => (
            <div key={field.key} className="flex items-center gap-3">
              <div className="flex-1"><Select value={mapping[field.key] || ""} onValueChange={v => handleChange(field.key, v)}><SelectTrigger><SelectValue placeholder="Selecione coluna" /></SelectTrigger><SelectContent><SelectItem value="">-- Ignorar --</SelectItem>{sourceColumns.map(col => <SelectItem key={col} value={col}>{col}</SelectItem>)}</SelectContent></Select></div>
              <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 flex items-center gap-2"><span className="text-sm">{field.label}</span>{field.required && <Badge variant="outline" className="text-xs">Obrigatório</Badge>}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
export default ImportMapping;
