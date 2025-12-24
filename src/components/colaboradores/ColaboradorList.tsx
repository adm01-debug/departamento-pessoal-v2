import { memo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
interface Colaborador { id: string; nome: string; cargo: string; departamento: string; status: "ativo" | "inativo"; }
interface ColaboradorListProps { colaboradores: Colaborador[]; onSelect?: (id: string) => void; }
export const ColaboradorList = memo(function ColaboradorList({ colaboradores, onSelect }: ColaboradorListProps) {
  return (
    <Table>
      <TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Cargo</TableHead><TableHead>Departamento</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
      <TableBody>{colaboradores.map(c => (
        <TableRow key={c.id} onClick={() => onSelect?.(c.id)} className="cursor-pointer">
          <TableCell className="flex items-center gap-2"><Avatar className="h-8 w-8"><AvatarFallback>{c.nome.slice(0,2).toUpperCase()}</AvatarFallback></Avatar>{c.nome}</TableCell>
          <TableCell>{c.cargo}</TableCell><TableCell>{c.departamento}</TableCell>
          <TableCell><Badge variant={c.status === "ativo" ? "default" : "secondary"}>{c.status}</Badge></TableCell>
        </TableRow>
      ))}</TableBody>
    </Table>
  );
});
