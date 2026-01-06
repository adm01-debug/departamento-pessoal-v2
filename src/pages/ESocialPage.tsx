import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Search, FileCheck, AlertTriangle, Clock, CheckCircle, XCircle, RefreshCw, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/common/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { formatDateTime } from '@/utils/formatters';
import { api } from '@/lib/api';

interface EventoESocial { id: string; tipo: string; descricao: string; colaborador?: string; status: 'pendente' | 'processando' | 'enviado' | 'aceito' | 'rejeitado'; recibo?: string; erros?: string[]; createdAt: string; enviadoEm?: string; }

const statusConfig = { pendente: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: Clock }, processando: { label: 'Processando', color: 'bg-blue-100 text-blue-800', icon: RefreshCw }, enviado: { label: 'Enviado', color: 'bg-purple-100 text-purple-800', icon: Send }, aceito: { label: 'Aceito', color: 'bg-green-100 text-green-800', icon: CheckCircle }, rejeitado: { label: 'Rejeitado', color: 'bg-red-100 text-red-800', icon: XCircle } };

export default function ESocialPage() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('todos');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: eventos, isLoading } = useQuery<EventoESocial[]>({ queryKey: ['esocial', tab], queryFn: async () => { const params = tab !== 'todos' ? `?status=${tab}` : ''; const r = await api.get(`/esocial/eventos${params}`); return r.data; } });
  const { data: stats } = useQuery({ queryKey: ['esocial-stats'], queryFn: async () => { const r = await api.get('/esocial/stats'); return r.data; } });

  const enviarMutation = useMutation({ mutationFn: async (ids: string[]) => { const r = await api.post('/esocial/enviar', { ids }); return r.data; }, onSuccess: () => { toast({ title: 'Eventos enviados' }); queryClient.invalidateQueries({ queryKey: ['esocial'] }); } });

  const filtered = eventos?.filter(e => e.tipo.toLowerCase().includes(search.toLowerCase()) || e.colaborador?.toLowerCase().includes(search.toLowerCase())) || [];

  const columns = [
    { accessorKey: 'tipo', header: 'Evento', cell: ({ row }: any) => <div><p className="font-medium">{row.original.tipo}</p><p className="text-sm text-muted-foreground">{row.original.descricao}</p></div> },
    { accessorKey: 'colaborador', header: 'Colaborador', cell: ({ row }: any) => row.original.colaborador || '-' },
    { accessorKey: 'createdAt', header: 'Criado em', cell: ({ row }: any) => formatDateTime(row.original.createdAt) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }: any) => { const c = statusConfig[row.original.status as keyof typeof statusConfig]; const Icon = c.icon; return <Badge className={c.color}><Icon className="w-3 h-3 mr-1" />{c.label}</Badge>; } },
    { accessorKey: 'recibo', header: 'Recibo', cell: ({ row }: any) => row.original.recibo || '-' },
    { accessorKey: 'actions', header: '', cell: ({ row }: any) => <div className="flex gap-1"><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>{row.original.status === 'pendente' && <Button variant="ghost" size="sm" onClick={() => enviarMutation.mutate([row.original.id])}><Send className="w-4 h-4" /></Button>}</div> },
  ];

  return (
    <PageLayout>
      <PageHeader title="eSocial" description="Gestão de eventos do eSocial" breadcrumb={[{ label: 'Home', href: '/' }, { label: 'eSocial' }]} actions={<div className="flex gap-2"><Button variant="outline"><Download className="w-4 h-4 mr-2" />Exportar</Button><Button onClick={() => enviarMutation.mutate(filtered.filter(e => e.status === 'pendente').map(e => e.id))}><Send className="w-4 h-4 mr-2" />Enviar Pendentes</Button></div>} />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{stats?.total || 0}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Pendentes</p><p className="text-2xl font-bold text-yellow-600">{stats?.pendentes || 0}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Enviados</p><p className="text-2xl font-bold text-purple-600">{stats?.enviados || 0}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Aceitos</p><p className="text-2xl font-bold text-green-600">{stats?.aceitos || 0}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Rejeitados</p><p className="text-2xl font-bold text-red-600">{stats?.rejeitados || 0}</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader>
          <Tabs value={tab} onValueChange={setTab}>
            <div className="flex justify-between items-center">
              <TabsList><TabsTrigger value="todos">Todos</TabsTrigger><TabsTrigger value="pendente">Pendentes</TabsTrigger><TabsTrigger value="enviado">Enviados</TabsTrigger><TabsTrigger value="aceito">Aceitos</TabsTrigger><TabsTrigger value="rejeitado">Rejeitados</TabsTrigger></TabsList>
              <div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" /><Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>{isLoading ? <LoadingSpinner /> : <DataTable columns={columns} data={filtered} />}</CardContent>
      </Card>
    </PageLayout>
  );
}
