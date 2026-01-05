import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { useEventoESocial } from "@/queries/esocialQueries";
import { Send, RefreshCw, FileText, Download } from "lucide-react";
export function ESocialDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const { data: evento, isLoading } = useEventoESocial(id!);
  if (isLoading) return <div>Carregando...</div>;
  if (!evento) return <div>Evento não encontrado</div>;
  return (<div className="space-y-6"><PageHeader title={`Evento ${evento.tipo}`} description={evento.colaboradorId ? `Colaborador: ${evento.colaboradorId}` : "Evento periódico"}><Button variant="outline"><Download className="h-4 w-4 mr-2" />XML</Button>{evento.status === "PENDENTE" && <Button><Send className="h-4 w-4 mr-2" />Transmitir</Button>}{evento.status === "ERRO" && <Button><RefreshCw className="h-4 w-4 mr-2" />Reprocessar</Button>}</PageHeader><div className="grid grid-cols-2 gap-4"><Card><CardHeader><CardTitle>Informações</CardTitle></CardHeader><CardContent className="space-y-2"><div className="flex justify-between"><span className="text-muted-foreground">Tipo:</span><span>{evento.tipo}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Competência:</span><span>{evento.competencia}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Status:</span><Badge>{evento.status}</Badge></div>{evento.recibo && <div className="flex justify-between"><span className="text-muted-foreground">Recibo:</span><span className="font-mono">{evento.recibo}</span></div>}</CardContent></Card>{evento.xml && <Card><CardHeader><CardTitle>XML</CardTitle></CardHeader><CardContent><pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-80">{evento.xml}</pre></CardContent></Card>}</div></div>);
}
export default ESocialDetalhePage;
