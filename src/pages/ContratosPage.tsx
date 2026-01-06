import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, FileText, Calendar, User, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/common/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatDate } from '@/utils/formatters';
import { api } from '@/lib/api';

interface Contrato { id: string; colaborador: string; tipo: 'clt' | 'pj' | 'estagio' | 'temporario'; dataInicio: string; dataFim?: string; status: 'ativo' | 'encerrado' | 'suspenso'; }

export default function ContratosPage() {
  const [search, setSearch] = useState('');
  const { data: contratos, isLoading } = useQuery<Contrato[]>({ queryKey: ['contratos'], queryFn: async () => { const r = await api.get('/contratos'); return r.data; } });
  const { data: stats } = useQuery({ queryKey: ['contratos-stats'], queryFn: async () => { const r = await api.get('/contratos/stats'); return r.data; } });

  const tipoLabel = { clt: 'CLT', pj: 'PJ', estagio: 'Estágio', temporario: 'Temporário' };
  const statusConfig = { ativo: { label: 'Ativo', color: 'bg-green-100 text-green-800' }, encerrado: { label: 'Encerrado', color: 'bg-gray-100 text-gray-800' }, suspenso: { label: 'Suspenso', color: 'bg-yellow-100 text-yellow-800' } };

  const filtered = contratos?.filter(c => c.colaborador.toLowerCase().includes(search.toLowerCase())) || [];
  const columns = [
    { accessorKey: 'colaborador', header: 'Colaborador' },
    { accessorKey: 'tipo', header: 'Tipo', cell: ({ row }: any) => <Badge variant="outline">{tipoLabel[row.original.tipo as keyof typeof tipoLabel]}</Badge> },
    { accessorKey: 'dataInicio', header: 'Início', cell: ({ row }: any) => formatDate(row.original.dataInicio) },
    { accessorKey: 'dataFim', header: 'Término', cell: ({ row }: any) => row.original.dataFim ? formatDate(row.original.dataFim) : '-' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }: any) => { const c = statusConfig[row.original.status as keyof typeof statusConfig]; return <Badge className={c.color}>{c.label}</Badge>; } },
  ];

  return (
    <PageLayout>
      <PageHeader title="Contratos" description="Gestão de contratos de trabalho" breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Contratos' }]} actions={<Button><Plus className="w-4 h-4 mr-2" />Novo Contrato</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{stats?.total || 0}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Ativos</p><p className="text-2xl font-bold text-green-600">{stats?.ativos || 0}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Vencendo</p><p className="text-2xl font-bold text-yellow-600">{stats?.vencendo || 0}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Encerrados</p><p className="text-2xl font-bold text-gray-600">{stats?.encerrados || 0}</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><div className="flex justify-between"><CardTitle>Lista de Contratos</CardTitle><div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" /><Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div></div></CardHeader>
        <CardContent>{isLoading ? <LoadingSpinner /> : <DataTable columns={columns} data={filtered} />}</CardContent>
      </Card>
    </PageLayout>
  );
}
