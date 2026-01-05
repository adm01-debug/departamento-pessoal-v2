import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Star } from "lucide-react";
export function DadosBancariosList({ contas = [], onEdit, onDelete, onSetPrincipal }: any) {
  if (!contas.length) return <div className="text-center py-8 text-muted-foreground">Nenhuma conta cadastrada</div>;
  return (
    <Table><TableHeader><TableRow><TableHead>Banco</TableHead><TableHead>Agência</TableHead><TableHead>Conta</TableHead><TableHead>Tipo</TableHead><TableHead>PIX</TableHead><TableHead></TableHead></TableRow></TableHeader>
    <TableBody>{contas.map((c: any) => <TableRow key={c.id}><TableCell className="font-medium">{c.principal && <Star className="w-4 h-4 text-yellow-500 inline mr-1" />}{c.banco}</TableCell><TableCell>{c.agencia}{c.digitoAgencia ? `-${c.digitoAgencia}` : ""}</TableCell><TableCell>{c.conta}{c.digitoConta ? `-${c.digitoConta}` : ""}</TableCell><TableCell><Badge variant="outline">{c.tipoConta}</Badge></TableCell><TableCell>{c.chavePix ? <Badge className="bg-green-100 text-green-800">Sim</Badge> : "-"}</TableCell><TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger><DropdownMenuContent>{!c.principal && <DropdownMenuItem onClick={() => onSetPrincipal?.(c.id)}><Star className="w-4 h-4 mr-2" />Definir Principal</DropdownMenuItem>}<DropdownMenuItem onClick={() => onEdit?.(c.id)}><Edit className="w-4 h-4 mr-2" />Editar</DropdownMenuItem><DropdownMenuItem onClick={() => onDelete?.(c.id)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Excluir</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}</TableBody></Table>
  );
}
export default DadosBancariosList;
