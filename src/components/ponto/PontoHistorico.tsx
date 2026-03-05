// @ts-nocheck
// V15-259: src/components/ponto/PontoHistorico.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import type { RegistroPonto } from '@/types';

interface PontoHistoricoProps {
  registros: RegistroPonto[];
}

const tipoLabels: Record<string, string> = {
  entrada: 'Entrada',
  saida_almoco: 'Saída Almoço',
  retorno_almoco: 'Retorno Almoço',
  saida: 'Saída',
};

const tipoBadgeColor: Record<string, string> = {
  entrada: 'bg-green-100 text-green-800',
  saida_almoco: 'bg-yellow-100 text-yellow-800',
  retorno_almoco: 'bg-blue-100 text-blue-800',
  saida: 'bg-red-100 text-red-800',
};

export function PontoHistorico({ registros }: PontoHistoricoProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Hora</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Local</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registros.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{format(new Date(r.data), 'dd/MM/yyyy')}</TableCell>
            <TableCell className="font-mono">{r.hora}</TableCell>
            <TableCell><Badge className={tipoBadgeColor[r.tipo]}>{tipoLabels[r.tipo]}</Badge></TableCell>
            <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">{r.endereco || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
