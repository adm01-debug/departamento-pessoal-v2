// @ts-nocheck
// V15-252: src/components/folha/FolhaItemTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, FileText } from 'lucide-react';
import type { ItemFolha } from '@/types';

interface FolhaItemTableProps {
  itens: ItemFolha[];
  onViewHolerite?: (colaboradorId: string) => void;
}

export function FolhaItemTable({ itens, onViewHolerite }: FolhaItemTableProps) {
  const fmt = (v: number) => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00';

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Colaborador</TableHead>
          <TableHead className="text-right">Salário Base</TableHead>
          <TableHead className="text-right">Proventos</TableHead>
          <TableHead className="text-right">Descontos</TableHead>
          <TableHead className="text-right">Líquido</TableHead>
          <TableHead className="text-right">FGTS</TableHead>
          <TableHead className="w-[80px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {itens.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.colaborador_nome}</TableCell>
            <TableCell className="text-right">{fmt(item.salario_base)}</TableCell>
            <TableCell className="text-right text-green-600">{fmt(item.total_proventos)}</TableCell>
            <TableCell className="text-right text-red-600">{fmt(item.total_descontos)}</TableCell>
            <TableCell className="text-right font-bold">{fmt(item.valor_liquido)}</TableCell>
            <TableCell className="text-right">{fmt(item.fgts)}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" onClick={() => onViewHolerite?.(item.colaborador_id)}>
                <FileText className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
