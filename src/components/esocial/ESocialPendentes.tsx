import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Check, Send } from "lucide-react";
interface EventoPendente { id: string; tipo: string; colaborador?: string; dataGeracao: string; status: "pendente" | "erro" | "processando"; erroMsg?: string; }
interface ESocialPendentesProps { eventos: EventoPendente[]; onTransmitir?: (id: string) => void; onTransmitirTodos?: () => void; }
export function ESocialPendentes({ eventos, onTransmitir, onTransmitirTodos }: ESocialPendentesProps) {
  const pendentes = eventos.filter(e => e.status === "pendente");
  const erros = eventos.filter(e => e.status === "erro");
  return (
    <Card><CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle className="text-base">Eventos eSocial Pendentes</CardTitle>{pendentes.length > 0 && <Button size="sm" onClick={onTransmitirTodos}><Send className="h-4 w-4 mr-1" />Transmitir Todos</Button>}</div></CardHeader><CardContent className="space-y-2">{eventos.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">Nenhum evento pendente</p> : eventos.slice(0, 5).map(ev => <div key={ev.id} className="flex items-center justify-between p-2 bg-muted rounded"><div className="flex items-center gap-2">{ev.status === "erro" ? <AlertTriangle className="h-4 w-4 text-red-500" /> : ev.status === "processando" ? <Clock className="h-4 w-4 text-yellow-500" /> : <Check className="h-4 w-4 text-green-500" />}<div><p className="font-medium text-sm">{ev.tipo}</p>{ev.colaborador && <p className="text-xs text-muted-foreground">{ev.colaborador}</p>}</div></div>{ev.status === "pendente" && <Button size="sm" variant="outline" onClick={() => onTransmitir?.(ev.id)}>Transmitir</Button>}</div>)}</CardContent></Card>
  );
}
export default ESocialPendentes;
