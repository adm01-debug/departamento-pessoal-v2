import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, AlertCircle, Info, Calendar, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
const TIPO_ICONS: Record<string, any> = { SISTEMA: Bell, TAREFA: FileText, ALERTA: AlertCircle, LEMBRETE: Calendar, APROVACAO: Check, INFO: Info };
const TIPO_COLORS: Record<string, string> = { ALERTA: "bg-red-100 text-red-800", LEMBRETE: "bg-yellow-100 text-yellow-800", APROVACAO: "bg-green-100 text-green-800", INFO: "bg-blue-100 text-blue-800" };
export function NotificacaoList({ notificacoes = [], onMarcarLida, onRemover }: any) {
  if (!notificacoes.length) return <div className="text-center py-8 text-muted-foreground">Nenhuma notificação</div>;
  return (
    <div className="space-y-2">{notificacoes.map((n: any) => { const Icon = TIPO_ICONS[n.tipo] || Bell; return <Card key={n.id} className={!n.lida ? "bg-blue-50" : ""}><CardContent className="p-4"><div className="flex justify-between"><div className="flex gap-3"><Icon className="w-5 h-5 mt-0.5" /><div><div className="flex items-center gap-2"><span className="font-medium">{n.titulo}</span><Badge className={TIPO_COLORS[n.tipo] || ""} variant="outline">{n.tipo}</Badge></div><p className="text-sm text-muted-foreground mt-1">{n.mensagem}</p><p className="text-xs text-muted-foreground mt-2">{n.dataEnvio}</p></div></div><div className="flex gap-1">{!n.lida && <Button variant="ghost" size="icon" onClick={() => onMarcarLida?.(n.id)}><Check className="w-4 h-4" /></Button>}<Button variant="ghost" size="icon" onClick={() => onRemover?.(n.id)}><X className="w-4 h-4" /></Button></div></div></CardContent></Card>; })}</div>
  );
}
export default NotificacaoList;
