// V15-329
import { PageLayout } from '@/components/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Plus, Edit } from 'lucide-react';
import { useState } from 'react';
const rubricas = [{ id: '1', codigo: '1000', nome: 'Salário Base', tipo: 'provento', incidencias: 'INSS, FGTS, IRRF' }, { id: '2', codigo: '1010', nome: 'Hora Extra 50%', tipo: 'provento', incidencias: 'INSS, FGTS, IRRF' }, { id: '3', codigo: '9000', nome: 'INSS', tipo: 'desconto', incidencias: '-' }, { id: '4', codigo: '9010', nome: 'IRRF', tipo: 'desconto', incidencias: '-' }];
export default function RubricasPage() {
  const [search, setSearch] = useState('');
  return (
    <PageLayout title="Rubricas" actions={<Button><Plus className="h-4 w-4 mr-2" />Nova</Button>}>
      <DataTableToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar rubrica..." />
      <Table><TableHeader><TableRow><TableHead>Código</TableHead><TableHead>Nome</TableHead><TableHead>Tipo</TableHead><TableHead>Incidências</TableHead><TableHead className="w-[80px]">Ações</TableHead></TableRow></TableHeader>
        <TableBody>{rubricas.map(r => (<TableRow key={r.id}><TableCell>{r.codigo}</TableCell><TableCell className="font-medium">{r.nome}</TableCell><TableCell><Badge variant={r.tipo === 'provento' ? 'default' : 'destructive'}>{r.tipo === 'provento' ? 'Provento' : 'Desconto'}</Badge></TableCell><TableCell className="text-sm text-muted-foreground">{r.incidencias}</TableCell><TableCell><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button></TableCell></TableRow>))}</TableBody>
      </Table>
    </PageLayout>
  );
}
