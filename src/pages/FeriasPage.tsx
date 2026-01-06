import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Calendar, Sun, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
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

interface Ferias { id: string; colaborador: string; inicio: string; fim: string; dias: number; status: 'programada' | 'em_gozo' | 'concluida' | 'cancelada'; abono: boolean; }

export default function FeriasPage() {
  const [search, setSearch] = useState('');
  const { data: ferias, isLoading } = useQuery<Ferias[]>({ queryKey: ['ferias'], queryFn: async () => { const r = await api.get('/ferias'); return r.data; } });
  const { data: stats } = useQuery({ queryKey: ['ferias-stats'], queryFn: async () => { const r = await api.get('/ferias/stats'); return r.data; } });

  const statusConfig = { programada: { label: 'Programada', color: 'bg-blue-100 text-blue-800' }, em_gozo: { label: 'Em Gozo', color: 'bg-green-100 text-green-800' }, concluida: { label: 'Concluída', color: 'bg-gray-100 text-gray-800' }, cancelada: { label: 'Cancelada', color: 'bg-red-100 text-red-800' } };

  const filtered = ferias?.filter(f => f.colaborador.toLowerCase().includes(search.toLowerCase())) || [];
  const columns = [
    { accessorKey: 'colaborador', header: 'Colaborador' },
    { accessorKey: 'inicio', header: 'Início', cell: ({ row }: any) => formatDate(row.original.inicio) },
    { accessorKey: 'fim', header: 'Fim', cell: ({ row }: any) => formatDate(row.original.fim) },
    { accessorKey: 'dias', header: 'Dias' },
    { accessorKey: 'abono', header: 'Abono', cell: ({ row }: any) => row.original.abono ? <Badge>Sim</Badge> : '-' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }: any) => { const c = statusConfig[row.original.status as keyof typeof statusConfig]; return <Badge className={c.color}>{c.label}</Badge>; } },
  ];

  return (
    <PageLayout>
      <PageHeader title="Férias" description="Gestão de férias dos colaboradores" breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Férias' }]} actions={<Button><Plus className="w-4 h-4 mr-2" />Programar Férias</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Programadas</p><p className="text-2xl font-bold text-blue-600">{stats?.programadas || 0}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Em Gozo</p><p className="text-2xl font-bold text-green-600">{stats?.emGozo || 0}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Vencidas</p><p className="text-2xl font-bold text-red-600">{stats?.vencidas || 0}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">A Vencer (30d)</p><p className="text-2xl font-bold text-yellow-600">{stats?.aVencer || 0}</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><div className="flex justify-between"><CardTitle>Lista de Férias</CardTitle><div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" /><Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div></div></CardHeader>
        <CardContent>{isLoading ? <LoadingSpinner /> : <DataTable columns={columns} data={filtered} />}</CardContent>
      </Card>
    </PageLayout>
  );
}
