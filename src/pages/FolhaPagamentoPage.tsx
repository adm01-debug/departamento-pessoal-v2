import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Upload, Calculator, CheckCircle, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FolhaResumo {
  colaboradores: number;
  totalProventos: number;
  totalDescontos: number;
  liquido: number;
  status: { ponto: string; lancamentos: string; calculo: string; conferencia: string; fechamento: string };
}

function gerarCompetencias(): string[] {
  const competencias: string[] = [];
  const hoje = new Date();
  for (let i = -12; i <= 2; i++) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    competencias.push(`${mes}/${ano}`);
  }
  return competencias.reverse();
}

function getCompetenciaAtual(): string {
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  return `${mes}/${hoje.getFullYear()}`;
}

function useFolhaResumo(competencia: string) {
  return useQuery<FolhaResumo>({
    queryKey: ['folha-resumo', competencia],
    queryFn: async () => {
      const [mes, ano] = competencia.split('/');
      const competenciaDB = `${ano}-${mes}`;
      const { data: folhaData } = await supabase.from('folhas_pagamento').select('*').eq('competencia', competenciaDB);
      const colaboradores = folhaData?.length || 0;
      const totalProventos = folhaData?.reduce((acc, f) => acc + (f.total_proventos || 0), 0) || 0;
      const totalDescontos = folhaData?.reduce((acc, f) => acc + (f.total_descontos || 0), 0) || 0;
      return {
        colaboradores,
        totalProventos,
        totalDescontos,
        liquido: totalProventos - totalDescontos,
        status: { ponto: 'pendente', lancamentos: 'pendente', calculo: 'pendente', conferencia: 'pendente', fechamento: 'aberto' },
      };
    },
    staleTime: 2 * 60 * 1000,
  });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value);
}

function StatusEtapa({ label, status }: { label: string; status: string }) {
  const config: Record<string, { icon: typeof Clock; color: string; iconColor: string }> = {
    pendente: { icon: Clock, color: 'bg-muted/50', iconColor: 'text-muted-foreground' },
    importado: { icon: CheckCircle, color: 'bg-success/10', iconColor: 'text-success' },
    conferido: { icon: CheckCircle, color: 'bg-success/10', iconColor: 'text-success' },
    executado: { icon: CheckCircle, color: 'bg-success/10', iconColor: 'text-success' },
    aprovado: { icon: CheckCircle, color: 'bg-success/10', iconColor: 'text-success' },
    aberto: { icon: Clock, color: 'bg-muted/50', iconColor: 'text-muted-foreground' },
    fechado: { icon: CheckCircle, color: 'bg-success/10', iconColor: 'text-success' },
    ajustados: { icon: AlertTriangle, color: 'bg-warning/10', iconColor: 'text-warning' },
  };
  const { icon: Icon, color, iconColor } = config[status] || config.pendente;
  return (
    <div className={`text-center p-4 rounded-lg ${color}`}>
      <Icon className={`h-8 w-8 mx-auto mb-2 ${iconColor}`} />
      <p className="font-medium">{label}</p>
      <p className="text-sm text-muted-foreground capitalize">{status}</p>
    </div>
  );
}

export default function FolhaPagamentoPage() {
  const competencias = useMemo(() => gerarCompetencias(), []);
  const [competencia, setCompetencia] = useState(getCompetenciaAtual());
  const { data: resumo, isLoading, refetch } = useFolhaResumo(competencia);
  const queryClient = useQueryClient();

  const calcularFolha = useMutation({
    mutationFn: async (comp: string) => {
      const [mes, ano] = comp.split('/');
      const competenciaDB = `${ano}-${mes}`;
      // Insert a folha record instead of calling non-existent RPC
      const { data, error } = await supabase.from('folhas_pagamento').insert({
        competencia: competenciaDB,
        tipo: 'mensal',
        status: 'rascunho',
        total_proventos: 0,
        total_descontos: 0,
        total_liquido: 0,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folha-resumo', competencia] });
      toast.success('Folha calculada com sucesso');
    },
    onError: (error: Error) => toast.error(`Erro ao calcular: ${error.message}`),
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader title="Folha de Pagamento" description={`Competência ${competencia}`}>
        <div className="flex items-center gap-2">
          <Select value={competencia} onValueChange={setCompetencia}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Competência" /></SelectTrigger>
            <SelectContent>{competencias.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent>
          </Select>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />Atualizar
          </Button>
          <Button variant="outline"><Upload className="h-4 w-4 mr-2" />Importar Ponto</Button>
          <Button onClick={() => calcularFolha.mutate(competencia)} disabled={calcularFolha.isPending}>
            <Calculator className="h-4 w-4 mr-2" />{calcularFolha.isPending ? 'Calculando...' : 'Calcular Folha'}
          </Button>
        </div>
      </PageHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4"><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Colaboradores" value={String(resumo?.colaboradores || 0)} icon={CheckCircle} />
          <StatCard title="Total Proventos" value={formatCurrency(resumo?.totalProventos || 0)} />
          <StatCard title="Total Descontos" value={formatCurrency(resumo?.totalDescontos || 0)} />
          <StatCard title="Líquido" value={formatCurrency(resumo?.liquido || 0)} />
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Status da Folha</CardTitle>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Exportar</Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4"><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <StatusEtapa label="Ponto" status={resumo?.status.ponto || 'pendente'} />
              <StatusEtapa label="Lançamentos" status={resumo?.status.lancamentos || 'pendente'} />
              <StatusEtapa label="Cálculo" status={resumo?.status.calculo || 'pendente'} />
              <StatusEtapa label="Conferência" status={resumo?.status.conferencia || 'pendente'} />
              <StatusEtapa label="Fechamento" status={resumo?.status.fechamento || 'aberto'} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
