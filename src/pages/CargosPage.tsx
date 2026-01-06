import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Briefcase, Users, DollarSign, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/common/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatCurrency } from '@/utils/formatters';
import { api } from '@/lib/api';

interface Cargo { id: string; nome: string; cbo: string; nivel: string; departamento: string; salarioBase: number; colaboradores: number; ativo: boolean; }

export default function CargosPage() {
  const [search, setSearch] = useState('');
  const { data: cargos, isLoading } = useQuery<Cargo[]>({ queryKey: ['cargos'], queryFn: async () => { const r = await api.get('/cargos'); return r.data; } });
  const { data: stats } = useQuery({ queryKey: ['cargos-stats'], queryFn: async () => { const r = await api.get('/cargos/stats'); return r.data; } });

  const filtered = cargos?.filter(c => c.nome.toLowerCase().includes(search.toLowerCase()) || c.cbo.includes(search)) || [];

  const columns = [
    { accessorKey: 'nome', header: 'Cargo', cell: ({ row }: any) => <div><p className="font-medium">{row.original.nome}</p><p className="text-sm text-muted-foreground">CBO: {row.original.cbo}</p></div> },
    { accessorKey: 'nivel', header: 'Nível', cell: ({ row }: any) => <Badge variant="outline">{row.original.nivel}</Badge> },
    { accessorKey: 'departamento', header: 'Departamento' },
    { accessorKey: 'salarioBase', header: 'Salário Base', cell: ({ row }: any) => formatCurrency(row.original.salarioBase) },
    { accessorKey: 'colaboradores', header: 'Colaboradores', cell: ({ row }: any) => <span className="flex items-center gap-1"><Users className="w-4 h-4" />{row.original.colaboradores}</span> },
    { accessorKey: 'ativo', header: 'Status', cell: ({ row }: any) => <Badge variant={row.original.ativo ? 'default' : 'secondary'}>{row.original.ativo ? 'Ativo' : 'Inativo'}</Badge> },
    { accessorKey: 'actions', header: '', cell: () => <div className="flex gap-1"><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-red-500" /></Button></div> },
  ];

  return (
    <PageLayout>
      <PageHeader title="Cargos" description="Gerencie os cargos da empresa" breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Cargos' }]} actions={<Button><Plus className="w-4 h-4 mr-2" />Novo Cargo</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-6"><div className="flex justify-between"><div><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{stats?.total || 0}</p></div><Briefcase className="w-8 h-8 text-muted-foreground" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between"><div><p className="text-sm text-muted-foreground">Ativos</p><p className="text-2xl font-bold text-green-600">{stats?.ativos || 0}</p></div><Users className="w-8 h-8 text-green-600" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between"><div><p className="text-sm text-muted-foreground">Média Salarial</p><p className="text-2xl font-bold">{formatCurrency(stats?.mediaSalarial || 0)}</p></div><DollarSign className="w-8 h-8 text-blue-600" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between"><div><p className="text-sm text-muted-foreground">Níveis</p><p className="text-2xl font-bold">{stats?.niveis || 0}</p></div><TrendingUp className="w-8 h-8 text-purple-600" /></div></CardContent></Card>
      </div>
      <Card>
        <CardHeader><div className="flex justify-between"><CardTitle>Lista de Cargos</CardTitle><div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Buscar cargo ou CBO..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div></div></CardHeader>
        <CardContent>{isLoading ? <LoadingSpinner /> : <DataTable columns={columns} data={filtered} />}</CardContent>
      </Card>
    </PageLayout>
  );
}
