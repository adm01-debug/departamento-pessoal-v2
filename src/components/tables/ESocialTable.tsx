import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Send } from "lucide-react";
interface Evento { id: string; tipo: string; colaborador?: string; competencia: string; status: string; dataGeracao: string; }
interface ESocialTableProps { data: Evento[]; onView?: (id: string) => void; onTransmitir?: (id: string) => void; }
const statusColors: Record<string, string> = { PENDENTE: "bg-yellow-100 text-yellow-800", TRANSMITIDO: "bg-green-100 text-green-800", PROCESSANDO: "bg-blue-100 text-blue-800", ERRO: "bg-red-100 text-red-800" };
export function ESocialTable({ data, onView, onTransmitir }: ESocialTableProps) {
  return (<Table><TableHeader><TableRow><TableHead>Tipo</TableHead><TableHead>Colaborador</TableHead><TableHead>Competência</TableHead><TableHead>Geração</TableHead><TableHead>Status</TableHead><TableHead className="w-24"></TableHead></TableRow></TableHeader><TableBody>{data.map(e => <TableRow key={e.id}><TableCell className="font-medium">{e.tipo}</TableCell><TableCell>{e.colaborador || "-"}</TableCell><TableCell>{e.competencia}</TableCell><TableCell>{e.dataGeracao}</TableCell><TableCell><Badge className={statusColors[e.status]}>{e.status}</Badge></TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => onView?.(e.id)}><Eye className="h-4 w-4" /></Button>{e.status === "PENDENTE" && <Button variant="ghost" size="icon" onClick={() => onTransmitir?.(e.id)}><Send className="h-4 w-4" /></Button>}</div></TableCell></TableRow>)}</TableBody></Table>);
}
export default ESocialTable;
