import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Filter, Download, Upload, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/common/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { formatDate, formatCPF } from '@/utils/formatters';
import { api } from '@/lib/api';

interface Admissao {
  id: string;
  nome: string;
  cpf: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  status: 'pendente' | 'em_andamento' | 'documentos_pendentes' | 'concluida' | 'cancelada';
  etapaAtual: number;
  totalEtapas: number;
  responsavel: string;
  createdAt: string;
}

const statusConfig = {
  pendente: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  em_andamento: { label: 'Em Andamento', color: 'bg-blue-100 text-blue-800', icon: Clock },
  documentos_pendentes: { label: 'Docs Pendentes', color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
  concluida: { label: 'Concluída', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelada: { label: 'Cancelada', color: 'bg-red-100 text-red-800', icon: AlertCircle },
};

export default function AdmissoesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: admissoes, isLoading, error } = useQuery<Admissao[]>({
    queryKey: ['admissoes', statusFilter],
    queryFn: async () => {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const response = await api.get(`/admissoes${params}`);
      return response.data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['admissoes-stats'],
    queryFn: async () => {
      const response = await api.get('/admissoes/stats');
      return response.data;
    },
  });

  const filteredAdmissoes = admissoes?.filter(a =>
    a.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.cpf.includes(searchTerm) ||
    a.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const columns = [
    { accessorKey: 'nome', header: 'Colaborador', cell: ({ row }: any) => (
      <div>
        <p className="font-medium">{row.original.nome}</p>
        <p className="text-sm text-muted-foreground">{formatCPF(row.original.cpf)}</p>
      </div>
    )},
    { accessorKey: 'cargo', header: 'Cargo' },
    { accessorKey: 'departamento', header: 'Departamento' },
    { accessorKey: 'dataAdmissao', header: 'Data Admissão', cell: ({ row }: any) => formatDate(row.original.dataAdmissao) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }: any) => {
      const config = statusConfig[row.original.status as keyof typeof statusConfig];
      const Icon = config.icon;
      return (
        <Badge className={config.color}>
          <Icon className="w-3 h-3 mr-1" />
          {config.label}
        </Badge>
      );
    }},
    { accessorKey: 'etapaAtual', header: 'Progresso', cell: ({ row }: any) => (
      <div className="flex items-center gap-2">
        <div className="w-24 h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-primary rounded-full" 
            style={{ width: `${(row.original.etapaAtual / row.original.totalEtapas) * 100}%` }}
          />
        </div>
        <span className="text-sm">{row.original.etapaAtual}/{row.original.totalEtapas}</span>
      </div>
    )},
  ];

  if (error) {
    return (
      <PageLayout>
        <EmptyState
          icon={AlertCircle}
          title="Erro ao carregar admissões"
          description="Ocorreu um erro ao buscar os dados. Tente novamente."
          action={<Button onClick={() => queryClient.invalidateQueries({ queryKey: ['admissoes'] })}>Tentar novamente</Button>}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Admissões"
        description="Gerencie o processo de admissão de novos colaboradores"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Admissões' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Exportar</Button>
            <Button variant="outline" size="sm"><Upload className="w-4 h-4 mr-2" />Importar</Button>
            <Button onClick={() => setIsNewModalOpen(true)}><Plus className="w-4 h-4 mr-2" />Nova Admissão</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
              </div>
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.emAndamento || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">{stats?.concluidas || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Docs Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{stats?.docsPendentes || 0}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nome, CPF ou cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="documentos_pendentes">Docs Pendentes</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8"><LoadingSpinner /></div>
          ) : filteredAdmissoes.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="Nenhuma admissão encontrada"
              description="Não há admissões com os filtros selecionados."
              action={<Button onClick={() => setIsNewModalOpen(true)}><Plus className="w-4 h-4 mr-2" />Nova Admissão</Button>}
            />
          ) : (
            <DataTable columns={columns} data={filteredAdmissoes} />
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
}
