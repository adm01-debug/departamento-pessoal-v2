import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye } from "lucide-react";
interface Ferias { id: string; colaborador: string; periodo: string; dataInicio: string; dataFim: string; dias: number; status: string; }
interface FeriasTableProps { data: Ferias[]; onView?: (id: string) => void; }
const statusColors: Record<string, string> = { PROGRAMADA: "bg-blue-100 text-blue-800", EM_GOZO: "bg-green-100 text-green-800", CONCLUIDA: "bg-gray-100 text-gray-800", CANCELADA: "bg-red-100 text-red-800" };
export function FeriasTable({ data, onView }: FeriasTableProps) {
  return (<Table><TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Período Aquisitivo</TableHead><TableHead>Início</TableHead><TableHead>Fim</TableHead><TableHead className="text-center">Dias</TableHead><TableHead>Status</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader><TableBody>{data.map(f => <TableRow key={f.id}><TableCell className="font-medium">{f.colaborador}</TableCell><TableCell>{f.periodo}</TableCell><TableCell>{f.dataInicio}</TableCell><TableCell>{f.dataFim}</TableCell><TableCell className="text-center">{f.dias}</TableCell><TableCell><Badge className={statusColors[f.status]}>{f.status}</Badge></TableCell><TableCell><Button variant="ghost" size="icon" onClick={() => onView?.(f.id)}><Eye className="h-4 w-4" /></Button></TableCell></TableRow>)}</TableBody></Table>);
}
export default FeriasTable;
