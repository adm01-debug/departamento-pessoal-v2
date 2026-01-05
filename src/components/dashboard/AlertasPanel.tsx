import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, FileText, Calendar, CheckCircle } from "lucide-react";
interface Alerta { tipo: "vencimento" | "pendencia" | "erro" | "info"; titulo: string; descricao: string; data?: string; acao?: () => void; acaoLabel?: string; }
interface AlertasPanelProps { alertas: Alerta[]; }
const iconMap = { vencimento: <AlertTriangle className="h-5 w-5 text-yellow-500" />, pendencia: <Clock className="h-5 w-5 text-orange-500" />, erro: <AlertTriangle className="h-5 w-5 text-red-500" />, info: <CheckCircle className="h-5 w-5 text-blue-500" /> };
const bgMap = { vencimento: "bg-yellow-50 border-yellow-200", pendencia: "bg-orange-50 border-orange-200", erro: "bg-red-50 border-red-200", info: "bg-blue-50 border-blue-200" };
export function AlertasPanel({ alertas }: AlertasPanelProps) {
  return (
    <Card><CardHeader><CardTitle className="text-base">Alertas</CardTitle></CardHeader><CardContent className="space-y-2">{alertas.length === 0 ? <div className="text-center py-4"><CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" /><p className="text-sm text-muted-foreground">Nenhum alerta pendente</p></div> : alertas.map((alerta, i) => <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${bgMap[alerta.tipo]}`}>{iconMap[alerta.tipo]}<div className="flex-1"><p className="font-medium text-sm">{alerta.titulo}</p><p className="text-xs text-muted-foreground">{alerta.descricao}</p>{alerta.data && <p className="text-xs text-muted-foreground mt-1"><Calendar className="inline h-3 w-3 mr-1" />{alerta.data}</p>}</div></div>)}</CardContent></Card>
  );
}
export default AlertasPanel;
