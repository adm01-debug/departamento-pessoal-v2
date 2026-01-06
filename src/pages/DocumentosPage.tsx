import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, FileText, Upload, Download, Eye, Trash2, FolderOpen, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/common/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatDate, formatBytes } from '@/utils/formatters';
import { api } from '@/lib/api';

interface Documento { id: string; nome: string; tipo: string; colaborador: string; tamanho: number; dataUpload: string; validade?: string; status: 'ativo' | 'vencido' | 'pendente'; }

export default function DocumentosPage() {
  const [search, setSearch] = useState('');
  const { data: documentos, isLoading } = useQuery<Documento[]>({ queryKey: ['documentos'], queryFn: async () => { const r = await api.get('/documentos'); return r.data; } });
  const { data: stats } = useQuery({ queryKey: ['documentos-stats'], queryFn: async () => { const r = await api.get('/documentos/stats'); return r.data; } });

  const statusConfig = { ativo: { label: 'Ativo', color: 'bg-green-100 text-green-800' }, vencido: { label: 'Vencido', color: 'bg-red-100 text-red-800' }, pendente: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' } };

  const filtered = documentos?.filter(d => d.nome.toLowerCase().includes(search.toLowerCase()) || d.colaborador.toLowerCase().includes(search.toLowerCase())) || [];

  const columns = [
    { accessorKey: 'nome', header: 'Documento', cell: ({ row }: any) => <div className="flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /><div><p className="font-medium">{row.original.nome}</p><p className="text-sm text-muted-foreground">{row.original.tipo}</p></div></div> },
    { accessorKey: 'colaborador', header: 'Colaborador' },
    { accessorKey: 'tamanho', header: 'Tamanho', cell: ({ row }: any) => formatBytes(row.original.tamanho) },
    { accessorKey: 'dataUpload', header: 'Upload', cell: ({ row }: any) => formatDate(row.original.dataUpload) },
    { accessorKey: 'validade', header: 'Validade', cell: ({ row }: any) => row.original.validade ? formatDate(row.original.validade) : '-' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }: any) => { const c = statusConfig[row.original.status as keyof typeof statusConfig]; return <Badge className={c.color}>{c.label}</Badge>; } },
    { accessorKey: 'actions', header: '', cell: () => <div className="flex gap-1"><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-red-500" /></Button></div> },
  ];

  return (
    <PageLayout>
      <PageHeader title="Documentos" description="Gestão de documentos dos colaboradores" breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Documentos' }]} actions={<Button><Upload className="w-4 h-4 mr-2" />Upload</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-6"><div className="flex justify-between"><div><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{stats?.total || 0}</p></div><FileText className="w-8 h-8" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between"><div><p className="text-sm text-muted-foreground">Ativos</p><p className="text-2xl font-bold text-green-600">{stats?.ativos || 0}</p></div><CheckCircle className="w-8 h-8 text-green-600" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between"><div><p className="text-sm text-muted-foreground">Vencidos</p><p className="text-2xl font-bold text-red-600">{stats?.vencidos || 0}</p></div><Clock className="w-8 h-8 text-red-600" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between"><div><p className="text-sm text-muted-foreground">Armazenamento</p><p className="text-2xl font-bold">{formatBytes(stats?.armazenamento || 0)}</p></div><FolderOpen className="w-8 h-8 text-blue-600" /></div></CardContent></Card>
      </div>
      <Card>
        <CardHeader><div className="flex justify-between"><CardTitle>Lista de Documentos</CardTitle><div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" /><Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div></div></CardHeader>
        <CardContent>{isLoading ? <LoadingSpinner /> : <DataTable columns={columns} data={filtered} />}</CardContent>
      </Card>
    </PageLayout>
  );
}
