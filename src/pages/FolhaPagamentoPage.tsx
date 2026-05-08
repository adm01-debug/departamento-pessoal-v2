import { PageTitle } from '@/components/PageTitle';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Calculator, RefreshCw, Shield, Loader2, Banknote } from 'lucide-react';
import { edgeFunctionsService } from '@/services/edgeFunctionsService';
import { PageLayout } from '@/components/layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { FolhaKPIs, FolhaPipeline, FolhaValidationAlerts, FolhaComposicao, Simulador13Dialog, SimuladorWhatIf, CNABDialog, RelatorioContabilDialog, FGTSDigitalDashboard } from '@/components/folha';

/* ─── Helpers ─── */
function gerarCompetencias(): string[] {
  const competencias: string[] = [];
  const hoje = new Date();
  for (let i = -12; i <= 2; i++) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    competencias.push(`${mes}/${data.getFullYear()}`);
  }
  return competencias.reverse();
}

function getCompetenciaAtual(): string {
  const hoje = new Date();
  return `${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`;
}

/* ─── Data Hook ─── */
interface FolhaResumo {
  id?: string;
  colaboradores: number;
  totalProventos: number;
  totalDescontos: number;
  liquido: number;
  inss: number;
  fgts: number;
  irrf: number;
  status: Record<string, string>;
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
      const inss = totalProventos * 0.11;
      const fgts = totalProventos * 0.08;
      const irrf = Math.max(0, totalDescontos - inss);
      const hasData = colaboradores > 0;
      return {
        id: folhaData?.[0]?.id,
        colaboradores, totalProventos, totalDescontos, inss, fgts, irrf,
        liquido: totalProventos - totalDescontos,
        status: {
          ponto: hasData ? 'importado' : 'pendente',
          lancamentos: hasData ? 'conferido' : 'pendente',
          calculo: hasData ? 'executado' : 'pendente',
          conferencia: 'pendente',
          fechamento: 'aberto',
        },
      };
    },
    staleTime: 2 * 60 * 1000,
  });
}

/* ─── Main Page ─── */
export default function FolhaPagamentoPage() {
  const competencias = useMemo(() => gerarCompetencias(), []);
  const [competencia, setCompetencia] = useState(getCompetenciaAtual());
  const { data: resumo, isLoading, refetch } = useFolhaResumo(competencia);
  const queryClient = useQueryClient();
  const [calcServidor, setCalcServidor] = useState(false);

  const calcularFolha = useMutation({
    mutationFn: async (comp: string) => {
      const [mes, ano] = comp.split('/');
      const competenciaDB = `${ano}-${mes}`;
      const { data: existing } = await supabase.from('folhas_pagamento').select('id').eq('competencia', competenciaDB).maybeSingle();
      if (existing) {
        const { data, error } = await supabase.from('folhas_pagamento')
          .update({ status: 'calculada' as const, data_calculo: new Date().toISOString() })
          .eq('id', existing.id).select().single();
        if (error) throw error;
        return data;
      }
      const { data, error } = await supabase.from('folhas_pagamento')
        .insert({ competencia: competenciaDB, tipo: 'mensal' }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folha-resumo', competencia] });
      toast.success('Folha calculada com sucesso!');
    },
    onError: (error: Error) => toast.error(`Erro: ${error.message}`),
  });

  const calcularFolhaServidor = async () => {
    setCalcServidor(true);
    try {
      const [mes, ano] = competencia.split('/');
      await edgeFunctionsService.calcularFolha({ empresaId: '', competencia: `${ano}-${mes}` });
      queryClient.invalidateQueries({ queryKey: ['folha-resumo', competencia] });
      toast.success('Folha calculada no servidor com sucesso!');
    } catch (err: any) {
      toast.error(`Erro: ${err.message}`);
    } finally {
      setCalcServidor(false);
    }
  };

  return (
    <>
      <PageTitle title="Cálculo de Folha" description="Processamento de folha de pagamento" />
      <PageLayout
        title="Processamento de Folha"
        description={`Competência ${competencia}`}
        icon={<Banknote className="h-5 w-5 text-primary-foreground" />}
        gradient="from-primary to-primary-glow"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={competencia} onValueChange={setCompetencia}>
              <SelectTrigger className="w-[130px] rounded-xl" aria-label="Selecionar competência">
                <SelectValue placeholder="Mês/Ano" />
              </SelectTrigger>
              <SelectContent>
                {competencias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-xl" aria-label="Atualizar dados">
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl gap-1.5 font-body">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Importar Ponto</span>
            </Button>
            <Button
              size="sm"
              onClick={() => calcularFolha.mutate(competencia)}
              disabled={calcularFolha.isPending}
              className="rounded-xl gap-1.5 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 shadow-lg font-body"
            >
              <Calculator className="h-4 w-4" />
              {calcularFolha.isPending ? 'Calculando...' : 'Calcular'}
            </Button>
            <Button
              size="sm" variant="outline"
              onClick={calcularFolhaServidor}
              disabled={calcServidor}
              className="rounded-xl gap-1.5 font-body"
            >
              {calcServidor ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
              <span className="hidden sm:inline">Servidor</span>
            </Button>
            <Simulador13Dialog />
            <SimuladorWhatIf />
            {resumo?.id && <CNABDialog folhaId={resumo.id} />}
            {resumo?.id && <RelatorioContabilDialog folhaId={resumo.id} />}
          </div>
        }
      >
        <FolhaKPIs resumo={resumo} isLoading={isLoading} />

        {resumo && <FolhaPipeline status={resumo.status} competencia={competencia} />}

        {!isLoading && resumo && <FolhaValidationAlerts resumo={resumo} />}

        {!isLoading && resumo && resumo.colaboradores > 0 && (
          <FolhaComposicao
            totalProventos={resumo.totalProventos}
            inss={resumo.inss}
            irrf={resumo.irrf}
            fgts={resumo.fgts}
            totalDescontos={resumo.totalDescontos}
          />
        )}
      </PageLayout>
    </>
  );
}
