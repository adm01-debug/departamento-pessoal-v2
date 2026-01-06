import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Building2, Users, User, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/common/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { api } from '@/lib/api';

interface Departamento { id: string; nome: string; codigo: string; gestor: string; colaboradores: number; ativo: boolean; centroCusto: string; }

export default function DepartamentosPage() {
  const [search, setSearch] = useState('');
  const { data: departamentos, isLoading } = useQuery<Departamento[]>({ queryKey: ['departamentos'], queryFn: async () => { const r = await api.get('/departamentos'); return r.data; } });
  const { data: stats } = useQuery({ queryKey: ['departamentos-stats'], queryFn: async () => { const r = await api.get('/departamentos/stats'); return r.data; } });

  const filtered = departamentos?.filter(d => d.nome.toLowerCase().includes(search.toLowerCase()) || d.codigo.includes(search)) || [];

  const columns = [
    { accessorKey: 'nome', header: 'Departamento', cell: ({ row }: any) => <div><p className="font-medium">{row.original.nome}</p><p className="text-sm text-muted-foreground">Código: {row.original.codigo}</p></div> },
    { accessorKey: 'gestor', header: 'Gestor', cell: ({ row }: any) => <div className="flex items-center gap-2"><User className="w-4 h-4" />{row.original.gestor}</div> },
    { accessorKey: 'colaboradores', header: 'Colaboradores', cell: ({ row }: any) => <div className="flex items-center gap-2"><Users className="w-4 h-4" />{row.original.colaboradores}</div> },
    { accessorKey: 'centroCusto', header: 'Centro de Custo' },
    { accessorKey: 'ativo', header: 'Status', cell: ({ row }: any) => <Badge variant={row.original.ativo ? 'default' : 'secondary'}>{row.original.ativo ? 'Ativo' : 'Inativo'}</Badge> },
    { accessorKey: 'actions', header: '', cell: () => <div className="flex gap-1"><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-red-500" /></Button></div> },
  ];

  return (
    <PageLayout>
      <PageHeader title="Departamentos" description="Gestão da estrutura organizacional" breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Departamentos' }]} actions={<Button><Plus className="w-4 h-4 mr-2" />Novo Departamento</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-6"><div className="flex justify-between"><div><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{stats?.total || 0}</p></div><Building2 className="w-8 h-8 text-muted-foreground" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between"><div><p className="text-sm text-muted-foreground">Ativos</p><p className="text-2xl font-bold text-green-600">{stats?.ativos || 0}</p></div><Building2 className="w-8 h-8 text-green-600" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between"><div><p className="text-sm text-muted-foreground">Colaboradores</p><p className="text-2xl font-bold">{stats?.colaboradores || 0}</p></div><Users className="w-8 h-8 text-blue-600" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between"><div><p className="text-sm text-muted-foreground">Média/Dept</p><p className="text-2xl font-bold">{stats?.media || 0}</p></div><TrendingUp className="w-8 h-8 text-purple-600" /></div></CardContent></Card>
      </div>
      <Card>
        <CardHeader><div className="flex justify-between"><CardTitle>Lista de Departamentos</CardTitle><div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" /><Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div></div></CardHeader>
        <CardContent>{isLoading ? <LoadingSpinner /> : <DataTable columns={columns} data={filtered} />}</CardContent>
      </Card>
    </PageLayout>
  );
}
