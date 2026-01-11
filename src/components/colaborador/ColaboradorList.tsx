// V15-248: src/components/colaborador/ColaboradorList.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColaboradorStatus } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Colaborador } from '@/types';

interface ColaboradorListProps {
  colaboradores: Colaborador[];
  onDelete?: (id: string) => void;
}

export function ColaboradorList({ colaboradores, onDelete }: ColaboradorListProps) {
  const navigate = useNavigate();
  const formatCPF = (cpf: string) => cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') || '';

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>CPF</TableHead>
          <TableHead>Cargo</TableHead>
          <TableHead>Departamento</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[120px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {colaboradores.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-medium">{c.nome}</TableCell>
            <TableCell>{formatCPF(c.cpf)}</TableCell>
            <TableCell>{c.cargo || '-'}</TableCell>
            <TableCell>{c.departamento || '-'}</TableCell>
            <TableCell><ColaboradorStatus status={c.status} /></TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => navigate(`/colaboradores/${c.id}`)}><Eye className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => navigate(`/colaboradores/${c.id}/editar`)}><Edit className="h-4 w-4" /></Button>
                {onDelete && <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(c.id)}><Trash2 className="h-4 w-4" /></Button>}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
