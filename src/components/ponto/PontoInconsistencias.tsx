import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, Check, X } from "lucide-react";
interface Inconsistencia { id: string; colaborador: string; data: string; tipo: string; descricao: string; status: "pendente" | "tratada" | "ignorada"; }
interface PontoInconsistenciasProps { inconsistencias: Inconsistencia[]; onTratar?: (id: string) => void; onIgnorar?: (id: string) => void; }
export function PontoInconsistencias({ inconsistencias, onTratar, onIgnorar }: PontoInconsistenciasProps) {
  const pendentes = inconsistencias.filter(i => i.status === "pendente");
  return (
    <Card className={pendentes.length > 0 ? "border-yellow-200" : ""}><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-yellow-500" />Inconsistências ({pendentes.length})</CardTitle></CardHeader><CardContent className="space-y-2">{pendentes.length === 0 ? <div className="text-center py-4"><Check className="h-8 w-8 text-green-500 mx-auto mb-2" /><p className="text-sm text-muted-foreground">Todas inconsistências tratadas</p></div> : pendentes.slice(0, 5).map(inc => <div key={inc.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"><div className="flex items-center gap-3"><Clock className="h-5 w-5 text-yellow-600" /><div><p className="font-medium text-sm">{inc.colaborador}</p><p className="text-xs text-muted-foreground">{inc.data} - {inc.tipo}</p><p className="text-xs">{inc.descricao}</p></div></div><div className="flex gap-1"><Button size="sm" onClick={() => onTratar?.(inc.id)}>Tratar</Button><Button size="sm" variant="ghost" onClick={() => onIgnorar?.(inc.id)}><X className="h-4 w-4" /></Button></div></div>)}</CardContent></Card>
  );
}
export default PontoInconsistencias;
