// V18-FIX-003: FolhaPagamentoPage com competência dinâmica
// Atualizado em 16/01/2026 - Competência baseada na data atual
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Download, Upload, Calculator, CheckCircle, AlertTriangle, Clock, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";

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
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    competencias.push(`${mes}/${ano}`);
  }
  return competencias.reverse();
}

function getCompetenciaAtual(): string {
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const ano = hoje.getFullYear();
  return `${mes}/${ano}`;
}

function useFolhaResumo(competencia: string) {
  return useQuery<FolhaResumo>({
    queryKey: ["folha-resumo", competencia],
    queryFn: async () => {
      const [mes, ano] = competencia.split("/");
      const competenciaDB = `${ano}-${mes}`;

      const { data: folhaData } = await supabase.from("folha_pagamento").select("*").eq("competencia", competenciaDB);
      const { data: statusData } = await supabase.from("folha_status").select("*").eq("competencia", competenciaDB).single();

      const colaboradores = folhaData?.length || 0;
      const totalProventos = folhaData?.reduce((acc, f) => acc + (f.total_proventos || 0), 0) || 0;
      const totalDescontos = folhaData?.reduce((acc, f) => acc + (f.total_descontos || 0), 0) || 0;

      return {
        colaboradores,
        totalProventos,
        totalDescontos,
        liquido: totalProventos - totalDescontos,
        status: statusData || { ponto: "pendente", lancamentos: "pendente", calculo: "pendente", conferencia: "pendente", fechamento: "aberto" },
      };
    },
    staleTime: 2 * 60 * 1000,
  });
}

function useCalcularFolha() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (competencia: string) => {
      const [mes, ano] = competencia.split("/");
      const { data, error } = await supabase.rpc("calcular_folha", { p_competencia: `${ano}-${mes}` });
      if (error) throw error;
      return data;
    },
    onSuccess: (_, competencia) => {
      queryClient.invalidateQueries({ queryKey: ["folha-resumo", competencia] });
      toast({ title: "Folha calculada", description: "Cálculo da folha executado com sucesso" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao calcular", description: error.message, variant: "destructive" });
    },
  });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(value);
}

function StatusEtapa({ label, status }: { label: string; status: string }) {
  const config: Record<string, { icon: typeof Clock; color: string; iconColor: string }> = {
    pendente: { icon: Clock, color: "bg-gray-100", iconColor: "text-gray-400" },
    importado: { icon: CheckCircle, color: "bg-green-50", iconColor: "text-green-600" },
    conferido: { icon: CheckCircle, color: "bg-green-50", iconColor: "text-green-600" },
    executado: { icon: CheckCircle, color: "bg-green-50", iconColor: "text-green-600" },
    aprovado: { icon: CheckCircle, color: "bg-green-50", iconColor: "text-green-600" },
    aberto: { icon: Clock, color: "bg-gray-100", iconColor: "text-gray-400" },
    fechado: { icon: CheckCircle, color: "bg-green-50", iconColor: "text-green-600" },
    ajustados: { icon: AlertTriangle, color: "bg-yellow-50", iconColor: "text-yellow-600" },
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

export function FolhaPagamentoPage() {
  const competencias = useMemo(() => gerarCompetencias(), []);
  const [competencia, setCompetencia] = useState(getCompetenciaAtual());
  const { data: resumo, isLoading, refetch } = useFolhaResumo(competencia);
  const calcularFolha = useCalcularFolha();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader title="Folha de Pagamento" description={`Competência ${competencia}`}>
        <div className="flex items-center gap-2">
          <Select value={competencia} onValueChange={setCompetencia}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Competência" /></SelectTrigger>
            <SelectContent>{competencias.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent>
          </Select>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />Atualizar
          </Button>
          <Button variant="outline"><Upload className="h-4 w-4 mr-2" />Importar Ponto</Button>
          <Button onClick={() => calcularFolha.mutate(competencia)} disabled={calcularFolha.isPending}>
            <Calculator className="h-4 w-4 mr-2" />{calcularFolha.isPending ? "Calculando..." : "Calcular Folha"}
          </Button>
        </div>
      </PageHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4"><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Colaboradores" value={String(resumo?.colaboradores || 0)} icon={CheckCircle} />
          <StatCard title="Total Proventos" value={formatCurrency(resumo?.totalProventos || 0)} className="text-green-600" />
          <StatCard title="Total Descontos" value={formatCurrency(resumo?.totalDescontos || 0)} className="text-red-600" />
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
              <StatusEtapa label="Ponto" status={resumo?.status.ponto || "pendente"} />
              <StatusEtapa label="Lançamentos" status={resumo?.status.lancamentos || "pendente"} />
              <StatusEtapa label="Cálculo" status={resumo?.status.calculo || "pendente"} />
              <StatusEtapa label="Conferência" status={resumo?.status.conferencia || "pendente"} />
              <StatusEtapa label="Fechamento" status={resumo?.status.fechamento || "aberto"} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default FolhaPagamentoPage;
