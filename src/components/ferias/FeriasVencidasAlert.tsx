import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, CheckCircle, XCircle } from "lucide-react";
interface FeriasVencidasAlertProps { ferias: { colaboradorNome: string; dataVencimento: string; diasVencidos: number }[]; onProgramar?: (colaboradorId: string) => void; }
export function FeriasVencidasAlert({ ferias, onProgramar }: FeriasVencidasAlertProps) {
  if (ferias.length === 0) return null;
  return (
    <Card className="border-red-200 bg-red-50"><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2 text-red-700"><AlertTriangle className="h-5 w-5" />Férias Vencidas ({ferias.length})</CardTitle></CardHeader><CardContent className="space-y-2">{ferias.slice(0, 5).map((f, i) => <div key={i} className="flex items-center justify-between p-2 bg-white rounded border"><div><p className="font-medium">{f.colaboradorNome}</p><p className="text-sm text-muted-foreground">Venceu em {f.dataVencimento} ({f.diasVencidos} dias)</p></div><Button size="sm" onClick={() => onProgramar?.(f.colaboradorNome)}>Programar</Button></div>)}{ferias.length > 5 && <p className="text-sm text-red-600">+ {ferias.length - 5} mais...</p>}</CardContent></Card>
  );
}
export default FeriasVencidasAlert;
