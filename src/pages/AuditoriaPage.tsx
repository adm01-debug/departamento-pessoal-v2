import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Download, Eye, Clock, User, Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/common/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDateTime } from '@/utils/formatters';
import { api } from '@/lib/api';

interface AuditLog {
  id: string;
  acao: 'criar' | 'atualizar' | 'excluir' | 'visualizar' | 'login' | 'logout' | 'erro';
  entidade: string;
  entidadeId: string;
  usuario: string;
  usuarioId: string;
  ip: string;
  userAgent: string;
  dados: Record<string, any>;
  dadosAnteriores?: Record<string, any>;
  createdAt: string;
}

const acaoConfig = {
  criar: { label: 'Criar', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  atualizar: { label: 'Atualizar', color: 'bg-blue-100 text-blue-800', icon: Activity },
  excluir: { label: 'Excluir', color: 'bg-red-100 text-red-800', icon: XCircle },
  visualizar: { label: 'Visualizar', color: 'bg-gray-100 text-gray-800', icon: Eye },
  login: { label: 'Login', color: 'bg-purple-100 text-purple-800', icon: User },
  logout: { label: 'Logout', color: 'bg-orange-100 text-orange-800', icon: User },
  erro: { label: 'Erro', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
};

export default function AuditoriaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [acaoFilter, setAcaoFilter] = useState<string>('all');
  const [entidadeFilter, setEntidadeFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const { data: logs, isLoading } = useQuery<AuditLog[]>({
    queryKey: ['auditoria', acaoFilter, entidadeFilter, dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (acaoFilter !== 'all') params.append('acao', acaoFilter);
      if (entidadeFilter !== 'all') params.append('entidade', entidadeFilter);
      if (dateRange.start) params.append('dataInicio', dateRange.start);
      if (dateRange.end) params.append('dataFim', dateRange.end);
      const response = await api.get(`/auditoria?${params.toString()}`);
      return response.data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['auditoria-stats'],
    queryFn: async () => {
      const response = await api.get('/auditoria/stats');
      return response.data;
    },
  });

  const { data: entidades } = useQuery<string[]>({
    queryKey: ['auditoria-entidades'],
    queryFn: async () => {
      const response = await api.get('/auditoria/entidades');
      return response.data;
    },
  });

  const filteredLogs = logs?.filter(log =>
    log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ip.includes(searchTerm)
  ) || [];

  const columns = [
    { accessorKey: 'createdAt', header: 'Data/Hora', cell: ({ row }: any) => (
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        {formatDateTime(row.original.createdAt)}
      </div>
    )},
    { accessorKey: 'usuario', header: 'Usuário', cell: ({ row }: any) => (
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-muted-foreground" />
        {row.original.usuario}
      </div>
    )},
    { accessorKey: 'acao', header: 'Ação', cell: ({ row }: any) => {
      const config = acaoConfig[row.original.acao as keyof typeof acaoConfig];
      const Icon = config.icon;
      return (
        <Badge className={config.color}>
          <Icon className="w-3 h-3 mr-1" />
          {config.label}
        </Badge>
      );
    }},
    { accessorKey: 'entidade', header: 'Entidade', cell: ({ row }: any) => (
      <Badge variant="outline">{row.original.entidade}</Badge>
    )},
    { accessorKey: 'ip', header: 'IP' },
    { accessorKey: 'actions', header: 'Ações', cell: ({ row }: any) => (
      <Button variant="ghost" size="sm" onClick={() => setSelectedLog(row.original)}>
        <Eye className="w-4 h-4" />
      </Button>
    )},
  ];

  const exportLogs = () => {
    const csv = filteredLogs.map(log => 
      `${log.createdAt},${log.usuario},${log.acao},${log.entidade},${log.ip}`
    ).join('\n');
    const blob = new Blob([`Data,Usuário,Ação,Entidade,IP\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <PageLayout>
      <PageHeader
        title="Auditoria"
        description="Histórico completo de ações e alterações no sistema"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Auditoria' }]}
        actions={<Button variant="outline" onClick={exportLogs}><Download className="w-4 h-4 mr-2" />Exportar CSV</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total de Logs</p><p className="text-2xl font-bold">{stats?.total || 0}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Hoje</p><p className="text-2xl font-bold text-blue-600">{stats?.hoje || 0}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Alterações</p><p className="text-2xl font-bold text-green-600">{stats?.alteracoes || 0}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Erros</p><p className="text-2xl font-bold text-red-600">{stats?.erros || 0}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Buscar por usuário, entidade ou IP..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={acaoFilter} onValueChange={setAcaoFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Ação" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as ações</SelectItem>
                {Object.entries(acaoConfig).map(([key, val]) => (
                  <SelectItem key={key} value={key}>{val.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={entidadeFilter} onValueChange={setEntidadeFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Entidade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {entidades?.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? <div className="flex justify-center py-8"><LoadingSpinner /></div> : 
           filteredLogs.length === 0 ? <EmptyState icon={Activity} title="Nenhum log encontrado" description="Não há registros de auditoria com os filtros selecionados." /> :
           <DataTable columns={columns} data={filteredLogs} />}
        </CardContent>
      </Card>

      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Detalhes do Log</DialogTitle></DialogHeader>
          {selectedLog && (
            <ScrollArea className="max-h-96">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-muted-foreground">Data/Hora</p><p className="font-medium">{formatDateTime(selectedLog.createdAt)}</p></div>
                  <div><p className="text-sm text-muted-foreground">Usuário</p><p className="font-medium">{selectedLog.usuario}</p></div>
                  <div><p className="text-sm text-muted-foreground">IP</p><p className="font-medium">{selectedLog.ip}</p></div>
                  <div><p className="text-sm text-muted-foreground">Entidade</p><p className="font-medium">{selectedLog.entidade} #{selectedLog.entidadeId}</p></div>
                </div>
                <div><p className="text-sm text-muted-foreground mb-2">Dados</p><pre className="bg-muted p-3 rounded text-xs overflow-auto">{JSON.stringify(selectedLog.dados, null, 2)}</pre></div>
                {selectedLog.dadosAnteriores && <div><p className="text-sm text-muted-foreground mb-2">Dados Anteriores</p><pre className="bg-muted p-3 rounded text-xs overflow-auto">{JSON.stringify(selectedLog.dadosAnteriores, null, 2)}</pre></div>}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
