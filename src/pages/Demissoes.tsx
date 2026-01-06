import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, UserMinus, Calendar, DollarSign, FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/common/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { api } from '@/lib/api';

interface Demissao { id: string; colaborador: string; tipo: 'sem_justa_causa' | 'justa_causa' | 'pedido' | 'acordo'; dataDesligamento: string; avisoPrevio: 'trabalhado' | 'indenizado' | 'dispensado'; valorRescisao: number; status: 'pendente' | 'em_calculo' | 'aguardando_homologacao' | 'concluida'; }

export default function DemissoesPage() {
  const [search, setSearch] = useState('');
  const { data: demissoes, isLoading } = useQuery<Demissao[]>({ queryKey: ['demissoes'], queryFn: async () => { const r = await api.get('/demissoes'); return r.data; } });
  const { data: stats } = useQuery({ queryKey: ['demissoes-stats'], queryFn: async () => { const r = await api.get('/demissoes/stats'); return r.data; } });

  const tipoLabel = { sem_justa_causa: 'Sem Justa Causa', justa_causa: 'Justa Causa', pedido: 'Pedido', acordo: 'Acordo' };
  const statusConfig = { pendente: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' }, em_calculo: { label: 'Em Cálculo', color: 'bg-blue-100 text-blue-800' }, aguardando_homologacao: { label: 'Aguardando Homologação', color: 'bg-orange-100 text-orange-800' }, concluida: { label: 'Concluída', color: 'bg-green-100 text-green-800' } };

  const filtered = demissoes?.filter(d => d.colaborador.toLowerCase().includes(search.toLowerCase())) || [];
  const columns = [
    { accessorKey: 'colaborador', header: 'Colaborador' },
    { accessorKey: 'tipo', header: 'Tipo', cell: ({ row }: any) => <Badge variant="outline">{tipoLabel[row.original.tipo as keyof typeof tipoLabel]}</Badge> },
    { accessorKey: 'dataDesligamento', header: 'Data', cell: ({ row }: any) => formatDate(row.original.dataDesligamento) },
    { accessorKey: 'valorRescisao', header: 'Valor', cell: ({ row }: any) => formatCurrency(row.original.valorRescisao) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }: any) => { const c = statusConfig[row.original.status as keyof typeof statusConfig]; return <Badge className={c.color}>{c.label}</Badge>; } },
  ];

  return (
    <PageLayout>
      <PageHeader title="Demissões" description="Gestão de desligamentos e rescisões" breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Demissões' }]} actions={<Button><Plus className="w-4 h-4 mr-2" />Nova Demissão</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Mês</p><p className="text-2xl font-bold">{stats?.totalMes || 0}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Pendentes</p><p className="text-2xl font-bold text-yellow-600">{stats?.pendentes || 0}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Valor Total</p><p className="text-2xl font-bold">{formatCurrency(stats?.valorTotal || 0)}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Turnover</p><p className="text-2xl font-bold text-red-600">{stats?.turnover || 0}%</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><div className="flex justify-between"><CardTitle>Lista de Demissões</CardTitle><div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" /><Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div></div></CardHeader>
        <CardContent>{isLoading ? <LoadingSpinner /> : <DataTable columns={columns} data={filtered} />}</CardContent>
      </Card>
    </PageLayout>
  );
}
