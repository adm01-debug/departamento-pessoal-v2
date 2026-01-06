import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Users, Heart, GraduationCap, Baby, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/common/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatDate, formatCPF } from '@/utils/formatters';
import { api } from '@/lib/api';

interface Dependente { id: string; nome: string; cpf: string; colaborador: string; parentesco: 'filho' | 'conjuge' | 'pai' | 'mae' | 'outros'; dataNascimento: string; irrf: boolean; salarioFamilia: boolean; planoSaude: boolean; }

export default function DependentesPage() {
  const [search, setSearch] = useState('');
  const { data: dependentes, isLoading } = useQuery<Dependente[]>({ queryKey: ['dependentes'], queryFn: async () => { const r = await api.get('/dependentes'); return r.data; } });
  const { data: stats } = useQuery({ queryKey: ['dependentes-stats'], queryFn: async () => { const r = await api.get('/dependentes/stats'); return r.data; } });

  const parentescoLabel = { filho: 'Filho(a)', conjuge: 'Cônjuge', pai: 'Pai', mae: 'Mãe', outros: 'Outros' };

  const filtered = dependentes?.filter(d => d.nome.toLowerCase().includes(search.toLowerCase()) || d.colaborador.toLowerCase().includes(search.toLowerCase())) || [];

  const columns = [
    { accessorKey: 'nome', header: 'Dependente', cell: ({ row }: any) => <div><p className="font-medium">{row.original.nome}</p><p className="text-sm text-muted-foreground">{formatCPF(row.original.cpf)}</p></div> },
    { accessorKey: 'colaborador', header: 'Colaborador' },
    { accessorKey: 'parentesco', header: 'Parentesco', cell: ({ row }: any) => <Badge variant="outline">{parentescoLabel[row.original.parentesco as keyof typeof parentescoLabel]}</Badge> },
    { accessorKey: 'dataNascimento', header: 'Nascimento', cell: ({ row }: any) => formatDate(row.original.dataNascimento) },
    { accessorKey: 'beneficios', header: 'Benefícios', cell: ({ row }: any) => <div className="flex gap-1">{row.original.irrf && <Badge className="bg-blue-100 text-blue-800">IRRF</Badge>}{row.original.salarioFamilia && <Badge className="bg-green-100 text-green-800">SF</Badge>}{row.original.planoSaude && <Badge className="bg-purple-100 text-purple-800">PS</Badge>}</div> },
    { accessorKey: 'actions', header: '', cell: () => <div className="flex gap-1"><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-red-500" /></Button></div> },
  ];

  return (
    <PageLayout>
      <PageHeader title="Dependentes" description="Gestão de dependentes dos colaboradores" breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Dependentes' }]} actions={<Button><Plus className="w-4 h-4 mr-2" />Novo Dependente</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-6"><div className="flex justify-between"><div><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{stats?.total || 0}</p></div><Users className="w-8 h-8" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between"><div><p className="text-sm text-muted-foreground">IRRF</p><p className="text-2xl font-bold text-blue-600">{stats?.irrf || 0}</p></div><Heart className="w-8 h-8 text-blue-600" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between"><div><p className="text-sm text-muted-foreground">Salário Família</p><p className="text-2xl font-bold text-green-600">{stats?.salarioFamilia || 0}</p></div><Baby className="w-8 h-8 text-green-600" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between"><div><p className="text-sm text-muted-foreground">Plano Saúde</p><p className="text-2xl font-bold text-purple-600">{stats?.planoSaude || 0}</p></div><Heart className="w-8 h-8 text-purple-600" /></div></CardContent></Card>
      </div>
      <Card>
        <CardHeader><div className="flex justify-between"><CardTitle>Lista de Dependentes</CardTitle><div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" /><Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div></div></CardHeader>
        <CardContent>{isLoading ? <LoadingSpinner /> : <DataTable columns={columns} data={filtered} />}</CardContent>
      </Card>
    </PageLayout>
  );
}
