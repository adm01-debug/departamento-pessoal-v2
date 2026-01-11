// V15-123: src/stories/Tables.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

const meta: Meta = {
  title: 'Components/Tables',
  parameters: { layout: 'padded' },
};

export default meta;

const colaboradores = [
  { id: 1, nome: 'João Silva', cargo: 'Desenvolvedor', status: 'Ativo', salario: 5000 },
  { id: 2, nome: 'Maria Santos', cargo: 'Designer', status: 'Ativo', salario: 4500 },
  { id: 3, nome: 'Pedro Costa', cargo: 'Analista', status: 'Férias', salario: 4000 },
];

export const BasicTable: StoryObj = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Cargo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Salário</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {colaboradores.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-medium">{c.nome}</TableCell>
            <TableCell>{c.cargo}</TableCell>
            <TableCell>
              <Badge variant={c.status === 'Ativo' ? 'default' : 'secondary'}>{c.status}</Badge>
            </TableCell>
            <TableCell className="text-right">R$ {c.salario.toLocaleString('pt-BR')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const TableWithActions: StoryObj = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Cargo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {colaboradores.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-medium">{c.nome}</TableCell>
            <TableCell>{c.cargo}</TableCell>
            <TableCell><Badge>{c.status}</Badge></TableCell>
            <TableCell><Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
