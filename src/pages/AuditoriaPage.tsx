// V15-325
import { PageLayout } from '@/components/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { useState } from 'react';
const logs = [{ id: '1', data: '11/01/2025 14:32', usuario: 'admin@empresa.com', acao: 'CREATE', entidade: 'Colaborador', descricao: 'Criou colaborador João Silva' }, { id: '2', data: '11/01/2025 14:28', usuario: 'rh@empresa.com', acao: 'UPDATE', entidade: 'Folha', descricao: 'Atualizou folha 01/2025' }, { id: '3', data: '11/01/2025 14:20', usuario: 'admin@empresa.com', acao: 'DELETE', entidade: 'Benefício', descricao: 'Removeu benefício Vale Transporte' }];
const acaoColors: Record<string, string> = { CREATE: 'bg-green-100 text-green-800', UPDATE: 'bg-blue-100 text-blue-800', DELETE: 'bg-red-100 text-red-800' };
export default function AuditoriaPage() {
  const [search, setSearch] = useState('');
  return (
    <PageLayout title="Auditoria" description="Logs de atividades do sistema">
      <DataTableToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar logs..." />
      <Table><TableHeader><TableRow><TableHead>Data/Hora</TableHead><TableHead>Usuário</TableHead><TableHead>Ação</TableHead><TableHead>Entidade</TableHead><TableHead>Descrição</TableHead></TableRow></TableHeader>
        <TableBody>{logs.map(l => (<TableRow key={l.id}><TableCell>{l.data}</TableCell><TableCell>{l.usuario}</TableCell><TableCell><Badge className={acaoColors[l.acao]}>{l.acao}</Badge></TableCell><TableCell>{l.entidade}</TableCell><TableCell>{l.descricao}</TableCell></TableRow>))}</TableBody>
      </Table>
    </PageLayout>
  );
}
