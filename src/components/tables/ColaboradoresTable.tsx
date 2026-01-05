import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
interface Colaborador { id: string; nome: string; cpf: string; cargo: string; departamento: string; status: string; avatar?: string; }
interface ColaboradoresTableProps { data: Colaborador[]; onView?: (id: string) => void; onEdit?: (id: string) => void; onDelete?: (id: string) => void; }
const statusColors: Record<string, string> = { ATIVO: "bg-green-100 text-green-800", INATIVO: "bg-gray-100 text-gray-800", FERIAS: "bg-blue-100 text-blue-800", AFASTADO: "bg-yellow-100 text-yellow-800" };
export function ColaboradoresTable({ data, onView, onEdit, onDelete }: ColaboradoresTableProps) {
  return (<Table><TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>CPF</TableHead><TableHead>Cargo</TableHead><TableHead>Departamento</TableHead><TableHead>Status</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader><TableBody>{data.map(c => <TableRow key={c.id}><TableCell><UserAvatar name={c.nome} image={c.avatar} size="sm" showName /></TableCell><TableCell>{c.cpf}</TableCell><TableCell>{c.cargo}</TableCell><TableCell>{c.departamento}</TableCell><TableCell><Badge className={statusColors[c.status]}>{c.status}</Badge></TableCell><TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => onView?.(c.id)}><Eye className="h-4 w-4 mr-2" />Ver</DropdownMenuItem><DropdownMenuItem onClick={() => onEdit?.(c.id)}><Edit className="h-4 w-4 mr-2" />Editar</DropdownMenuItem><DropdownMenuItem onClick={() => onDelete?.(c.id)} className="text-red-600"><Trash2 className="h-4 w-4 mr-2" />Excluir</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}</TableBody></Table>);
}
export default ColaboradoresTable;
