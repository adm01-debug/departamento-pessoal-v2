import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Calculator, Search, DollarSign, Users, FileText, CheckCircle, Clock, Play, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/common/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatCurrency } from '@/utils/formatters';
import { api } from '@/lib/api';

interface FolhaItem { id: string; colaborador: string; salarioBruto: number; descontos: number; liquido: number; status: 'pendente' | 'calculada' | 'fechada'; }

export default function FolhaPage() {
  const [competencia, setCompetencia] = useState('2026-01');
  const [search, setSearch] = useState('');
  const { data: folha, isLoading } = useQuery<FolhaItem[]>({ queryKey: ['folha', competencia], queryFn: async () => { const r = await api.get(`/folha?competencia=${competencia}`); return r.data; } });
  const { data: stats } = useQuery({ queryKey: ['folha-stats', competencia], queryFn: async () => { const r = await api.get(`/folha/stats?competencia=${competencia}`); return r.data; } });

  const calcularMutation = useMutation({ mutationFn: async () => { await api.post(`/folha/calcular?competencia=${competencia}`); } });

  const statusConfig = { pendente: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' }, calculada: { label: 'Calculada', color: 'bg-blue-100 text-blue-800' }, fechada: { label: 'Fechada', color: 'bg-green-100 text-green-800' } };
  const filtered = folha?.filter(f => f.colaborador.toLowerCase().includes(search.toLowerCase())) || [];
  const columns = [
    { accessorKey: 'colaborador', header: 'Colaborador' },
    { accessorKey: 'salarioBruto', header: 'Bruto', cell: ({ row }: any) => formatCurrency(row.original.salarioBruto) },
    { accessorKey: 'descontos', header: 'Descontos', cell: ({ row }: any) => <span className="text-red-600">-{formatCurrency(row.original.descontos)}</span> },
    { accessorKey: 'liquido', header: 'Líquido', cell: ({ row }: any) => <span className="font-bold">{formatCurrency(row.original.liquido)}</span> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }: any) => { const c = statusConfig[row.original.status as keyof typeof statusConfig]; return <Badge className={c.color}>{c.label}</Badge>; } },
  ];

  return (
    <PageLayout>
      <PageHeader title="Folha de Pagamento" description="Gestão da folha de pagamento" breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Folha' }]} actions={<div className="flex gap-2"><Button variant="outline" onClick={() => calcularMutation.mutate()}><Calculator className="w-4 h-4 mr-2" />Calcular</Button><Button><Lock className="w-4 h-4 mr-2" />Fechar Folha</Button></div>} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Bruto</p><p className="text-2xl font-bold">{formatCurrency(stats?.totalBruto || 0)}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Descontos</p><p className="text-2xl font-bold text-red-600">{formatCurrency(stats?.totalDescontos || 0)}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Líquido</p><p className="text-2xl font-bold text-green-600">{formatCurrency(stats?.totalLiquido || 0)}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Colaboradores</p><p className="text-2xl font-bold">{stats?.colaboradores || 0}</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><div className="flex justify-between"><div className="flex gap-4 items-center"><CardTitle>Folha</CardTitle><Select value={competencia} onValueChange={setCompetencia}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="2026-01">Jan/2026</SelectItem><SelectItem value="2025-12">Dez/2025</SelectItem></SelectContent></Select></div><div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" /><Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div></div></CardHeader>
        <CardContent>{isLoading ? <LoadingSpinner /> : <DataTable columns={columns} data={filtered} />}</CardContent>
      </Card>
    </PageLayout>
  );
}
