// V15-477
import { PageLayout } from '@/components/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { useState } from 'react';
import { Download, Eye, Printer } from 'lucide-react';
const recibos = [{ id: '1', colaborador: 'João Silva', competencia: '01/2025', tipo: 'Mensal', valor: 4620, status: 'disponivel' }, { id: '2', colaborador: 'Maria Santos', competencia: '01/2025', tipo: 'Mensal', valor: 5280, status: 'disponivel' }, { id: '3', colaborador: 'João Silva', competencia: '12/2024', tipo: 'Mensal', valor: 4600, status: 'baixado' }];
export default function RecibosPage() {
  const [search, setSearch] = useState('');
  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return (
    <PageLayout title="Recibos de Pagamento">
      <DataTableToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar colaborador..." />
      <Table><TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Competência</TableHead><TableHead>Tipo</TableHead><TableHead>Valor Líquido</TableHead><TableHead>Status</TableHead><TableHead className="w-[120px]">Ações</TableHead></TableRow></TableHeader>
        <TableBody>{recibos.map(r => (<TableRow key={r.id}><TableCell className="font-medium">{r.colaborador}</TableCell><TableCell>{r.competencia}</TableCell><TableCell>{r.tipo}</TableCell><TableCell className="font-bold">{fmt(r.valor)}</TableCell><TableCell><Badge variant={r.status === 'disponivel' ? 'default' : 'secondary'}>{r.status}</Badge></TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button><Button variant="ghost" size="icon"><Printer className="h-4 w-4" /></Button></div></TableCell></TableRow>))}</TableBody>
      </Table>
    </PageLayout>
  );
}
