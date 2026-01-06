import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Gift, Users, DollarSign, Calendar, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/common/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { formatCurrency } from '@/utils/formatters';
import { api } from '@/lib/api';

interface Beneficio { id: string; nome: string; tipo: 'vale_alimentacao' | 'vale_transporte' | 'plano_saude' | 'seguro_vida' | 'outros'; valor: number; colaboradores: number; ativo: boolean; fornecedor: string; }

export default function BeneficiosPage() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('todos');
  const queryClient = useQueryClient();

  const { data: beneficios, isLoading } = useQuery<Beneficio[]>({ queryKey: ['beneficios'], queryFn: async () => { const r = await api.get('/beneficios'); return r.data; } });
  const { data: stats } = useQuery({ queryKey: ['beneficios-stats'], queryFn: async () => { const r = await api.get('/beneficios/stats'); return r.data; } });

  const tipoConfig: Record<string, { label: string; color: string }> = {
    vale_alimentacao: { label: 'Vale Alimentação', color: 'bg-orange-100 text-orange-800' },
    vale_transporte: { label: 'Vale Transporte', color: 'bg-blue-100 text-blue-800' },
    plano_saude: { label: 'Plano de Saúde', color: 'bg-green-100 text-green-800' },
    seguro_vida: { label: 'Seguro de Vida', color: 'bg-purple-100 text-purple-800' },
    outros: { label: 'Outros', color: 'bg-gray-100 text-gray-800' },
  };

  const filtered = beneficios?.filter(b => (tab === 'todos' || b.tipo === tab) && b.nome.toLowerCase().includes(search.toLowerCase())) || [];

  const columns = [
    { accessorKey: 'nome', header: 'Benefício', cell: ({ row }: any) => <div><p className="font-medium">{row.original.nome}</p><p className="text-sm text-muted-foreground">{row.original.fornecedor}</p></div> },
    { accessorKey: 'tipo', header: 'Tipo', cell: ({ row }: any) => { const c = tipoConfig[row.original.tipo]; return <Badge className={c.color}>{c.label}</Badge>; } },
    { accessorKey: 'valor', header: 'Valor', cell: ({ row }: any) => formatCurrency(row.original.valor) },
    { accessorKey: 'colaboradores', header: 'Beneficiários', cell: ({ row }: any) => <span>{row.original.colaboradores} colaboradores</span> },
    { accessorKey: 'ativo', header: 'Status', cell: ({ row }: any) => <Badge variant={row.original.ativo ? 'default' : 'secondary'}>{row.original.ativo ? 'Ativo' : 'Inativo'}</Badge> },
    { accessorKey: 'actions', header: '', cell: ({ row }: any) => <div className="flex gap-1"><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-red-500" /></Button></div> },
  ];

  return (
    <PageLayout>
      <PageHeader title="Benefícios" description="Gerencie os benefícios oferecidos aos colaboradores" breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Benefícios' }]} actions={<Button><Plus className="w-4 h-4 mr-2" />Novo Benefício</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-6"><div className="flex justify-between"><div><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{stats?.total || 0}</p></div><Gift className="w-8 h-8 text-muted-foreground" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between"><div><p className="text-sm text-muted-foreground">Beneficiários</p><p className="text-2xl font-bold">{stats?.beneficiarios || 0}</p></div><Users className="w-8 h-8 text-blue-600" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between"><div><p className="text-sm text-muted-foreground">Custo Mensal</p><p className="text-2xl font-bold">{formatCurrency(stats?.custoMensal || 0)}</p></div><DollarSign className="w-8 h-8 text-green-600" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between"><div><p className="text-sm text-muted-foreground">Ativos</p><p className="text-2xl font-bold text-green-600">{stats?.ativos || 0}</p></div><Calendar className="w-8 h-8 text-green-600" /></div></CardContent></Card>
      </div>
      <Card>
        <CardHeader>
          <Tabs value={tab} onValueChange={setTab}>
            <div className="flex justify-between items-center">
              <TabsList><TabsTrigger value="todos">Todos</TabsTrigger><TabsTrigger value="vale_alimentacao">VA</TabsTrigger><TabsTrigger value="vale_transporte">VT</TabsTrigger><TabsTrigger value="plano_saude">Saúde</TabsTrigger><TabsTrigger value="seguro_vida">Seguro</TabsTrigger></TabsList>
              <div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>{isLoading ? <LoadingSpinner /> : filtered.length === 0 ? <EmptyState icon={Gift} title="Nenhum benefício" description="Cadastre benefícios para seus colaboradores" /> : <DataTable columns={columns} data={filtered} />}</CardContent>
      </Card>
    </PageLayout>
  );
}
