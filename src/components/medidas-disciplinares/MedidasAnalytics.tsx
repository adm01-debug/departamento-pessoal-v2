import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, AlertTriangle, Users, Building2, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ColabRow {
  colaborador_id: string;
  nome_completo: string;
  setor: string;
  gestor_nome: string | null;
  total: number;
  advertencia_verbal: number;
  advertencia_escrita: number;
  suspensao: number;
  justa_causa: number;
  graves: number;
  ultima_ocorrencia: string;
  reincidente: boolean;
}
interface AgrupadoRow {
  setor?: string;
  gestor_nome?: string;
  total: number;
  colaboradores_envolvidos: number;
  reincidentes: number;
  suspensoes: number;
  justas_causas: number;
}
interface HeatCell { mes: string; tipo: string; total: number }
interface Analytics {
  periodo: { inicio: string; fim: string };
  resumo: {
    total_medidas: number;
    colaboradores_envolvidos: number;
    colaboradores_reincidentes: number;
    total_suspensoes: number;
    total_justas_causas: number;
  };
  por_colaborador: ColabRow[];
  por_setor: AgrupadoRow[];
  por_gestor: AgrupadoRow[];
  heatmap: HeatCell[];
}

const TIPO_LABEL: Record<string, string> = {
  advertencia_verbal: 'Verbal',
  advertencia_escrita: 'Escrita',
  suspensao: 'Suspensão',
  justa_causa: 'Justa Causa',
};
const TIPO_ORDER = ['advertencia_verbal', 'advertencia_escrita', 'suspensao', 'justa_causa'];

function todayISO(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function toCSV(rows: Array<Record<string, unknown>>, headers: Array<{ key: string; label: string }>): string {
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = headers.map(h => esc(h.label)).join(';');
  const body = rows.map(r => headers.map(h => esc(r[h.key])).join(';')).join('\n');
  return `\ufeff${head}\n${body}`;
}

function downloadBlob(content: BlobPart, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function MedidasAnalytics() {
  const { empresaAtual } = useEmpresas();
  const [inicio, setInicio] = useState<string>(todayISO(-180));
  const [fim, setFim] = useState<string>(todayISO(0));

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['medidas-analytics', empresaAtual?.id, inicio, fim],
    queryFn: async (): Promise<Analytics> => {
      const { data, error } = await supabase.rpc('medidas_analytics_reincidencia' as never, {
        p_empresa_id: empresaAtual!.id,
        p_data_inicio: inicio,
        p_data_fim: fim,
      } as never);
      if (error) throw error;
      return (data as unknown) as Analytics;
    },
    enabled: !!empresaAtual?.id && !!inicio && !!fim,
    staleTime: 60_000,
  });

  const heatmapGrid = useMemo(() => {
    if (!data) return { meses: [] as string[], matriz: {} as Record<string, Record<string, number>>, max: 0 };
    const meses = Array.from(new Set(data.heatmap.map(h => h.mes))).sort();
    const matriz: Record<string, Record<string, number>> = {};
    TIPO_ORDER.forEach(t => { matriz[t] = {}; meses.forEach(m => { matriz[t][m] = 0; }); });
    let max = 0;
    data.heatmap.forEach(h => {
      if (!matriz[h.tipo]) matriz[h.tipo] = {};
      matriz[h.tipo][h.mes] = h.total;
      if (h.total > max) max = h.total;
    });
    return { meses, matriz, max };
  }, [data]);

  const exportCSV = () => {
    if (!data) return;
    const colab = toCSV(data.por_colaborador as unknown as Array<Record<string, unknown>>, [
      { key: 'nome_completo', label: 'Colaborador' },
      { key: 'setor', label: 'Setor' },
      { key: 'gestor_nome', label: 'Gestor' },
      { key: 'total', label: 'Total' },
      { key: 'advertencia_verbal', label: 'Adv. Verbal' },
      { key: 'advertencia_escrita', label: 'Adv. Escrita' },
      { key: 'suspensao', label: 'Suspensões' },
      { key: 'justa_causa', label: 'Justa Causa' },
      { key: 'graves', label: 'Graves' },
      { key: 'reincidente', label: 'Reincidente' },
      { key: 'ultima_ocorrencia', label: 'Última Ocorrência' },
    ]);
    downloadBlob(colab, `medidas-reincidencia_${inicio}_a_${fim}.csv`, 'text/csv;charset=utf-8');
    toast.success('CSV exportado.');
  };

  const exportPDF = () => {
    if (!data) return;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const empresa = empresaAtual?.nome_fantasia ?? empresaAtual?.razao_social ?? '';
    doc.setFontSize(14);
    doc.text('Analytics de Reincidência — Medidas Disciplinares', 14, 14);
    doc.setFontSize(10);
    doc.text(`Empresa: ${empresa}`, 14, 21);
    doc.text(`Período: ${inicio} a ${fim}`, 14, 27);
    doc.text(
      `Total: ${data.resumo.total_medidas} • Reincidentes: ${data.resumo.colaboradores_reincidentes} • Suspensões: ${data.resumo.total_suspensoes} • Justa causa: ${data.resumo.total_justas_causas}`,
      14, 33
    );

    autoTable(doc, {
      startY: 40,
      head: [['Colaborador', 'Setor', 'Gestor', 'Total', 'AV', 'AE', 'Susp.', 'JC', 'Reinc.', 'Última']],
      body: data.por_colaborador.map(r => [
        r.nome_completo, r.setor, r.gestor_nome ?? '—',
        r.total, r.advertencia_verbal, r.advertencia_escrita, r.suspensao, r.justa_causa,
        r.reincidente ? 'Sim' : 'Não',
        r.ultima_ocorrencia,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [220, 38, 38] },
    });

    autoTable(doc, {
      head: [['Setor', 'Total', 'Colaboradores', 'Reincidentes', 'Suspensões', 'Justa Causa']],
      body: data.por_setor.map(r => [r.setor ?? '—', r.total, r.colaboradores_envolvidos, r.reincidentes, r.suspensoes, r.justas_causas]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235] },
    });

    autoTable(doc, {
      head: [['Gestor', 'Total', 'Colaboradores', 'Reincidentes', 'Suspensões', 'Justa Causa']],
      body: data.por_gestor.map(r => [r.gestor_nome ?? '—', r.total, r.colaboradores_envolvidos, r.reincidentes, r.suspensoes, r.justas_causas]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 163, 74] },
    });

    doc.save(`medidas-reincidencia_${inicio}_a_${fim}.pdf`);
    toast.success('PDF exportado.');
  };

  const heatColor = (v: number) => {
    if (heatmapGrid.max === 0 || v === 0) return 'bg-muted/40 text-muted-foreground';
    const ratio = v / heatmapGrid.max;
    if (ratio > 0.75) return 'bg-destructive text-destructive-foreground';
    if (ratio > 0.5) return 'bg-destructive/70 text-destructive-foreground';
    if (ratio > 0.25) return 'bg-destructive/40 text-foreground';
    return 'bg-destructive/20 text-foreground';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-primary" /> Filtros do Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <Label className="text-xs">Data início</Label>
              <Input type="date" value={inicio} onChange={e => setInicio(e.target.value)} className="w-[160px]" />
            </div>
            <div>
              <Label className="text-xs">Data fim</Label>
              <Input type="date" value={fim} onChange={e => setFim(e.target.value)} className="w-[160px]" />
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              Atualizar
            </Button>
            <div className="flex gap-2 ml-auto">
              <Button size="sm" variant="outline" onClick={exportCSV} disabled={!data || data.por_colaborador.length === 0}>
                <Download className="h-4 w-4 mr-1" /> CSV
              </Button>
              <Button size="sm" onClick={exportPDF} disabled={!data || data.por_colaborador.length === 0}>
                <FileText className="h-4 w-4 mr-1" /> PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : !data ? null : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Total de Medidas', value: data.resumo.total_medidas },
              { label: 'Colaboradores', value: data.resumo.colaboradores_envolvidos },
              { label: 'Reincidentes', value: data.resumo.colaboradores_reincidentes, danger: true },
              { label: 'Suspensões', value: data.resumo.total_suspensoes },
              { label: 'Justa Causa', value: data.resumo.total_justas_causas, danger: true },
            ].map((k) => (
              <Card key={k.label}>
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground">{k.label}</div>
                  <div className={`text-2xl font-display font-semibold ${k.danger && k.value > 0 ? 'text-destructive' : ''}`}>{k.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-display">Heatmap — Mês × Tipo</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {heatmapGrid.meses.length === 0 ? (
                <div className="text-sm text-muted-foreground">Sem ocorrências no período.</div>
              ) : (
                <table className="text-xs border-separate border-spacing-1">
                  <thead>
                    <tr>
                      <th className="text-left px-2 py-1 text-muted-foreground">Tipo</th>
                      {heatmapGrid.meses.map(m => (
                        <th key={m} className="px-2 py-1 text-muted-foreground text-center">{m}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TIPO_ORDER.map(t => (
                      <tr key={t}>
                        <td className="px-2 py-1 font-medium">{TIPO_LABEL[t]}</td>
                        {heatmapGrid.meses.map(m => {
                          const v = heatmapGrid.matriz[t]?.[m] ?? 0;
                          return (
                            <td
                              key={m}
                              className={`px-3 py-2 rounded-md text-center font-semibold min-w-[52px] ${heatColor(v)}`}
                              title={`${TIPO_LABEL[t]} • ${m}: ${v}`}
                            >
                              {v}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> Por Setor
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Setor</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Colab.</TableHead>
                      <TableHead className="text-right">Reincid.</TableHead>
                      <TableHead className="text-right">Susp.</TableHead>
                      <TableHead className="text-right">JC</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.por_setor.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{r.setor}</TableCell>
                        <TableCell className="text-right">{r.total}</TableCell>
                        <TableCell className="text-right">{r.colaboradores_envolvidos}</TableCell>
                        <TableCell className="text-right">{r.reincidentes > 0 ? <Badge variant="destructive">{r.reincidentes}</Badge> : 0}</TableCell>
                        <TableCell className="text-right">{r.suspensoes}</TableCell>
                        <TableCell className="text-right">{r.justas_causas}</TableCell>
                      </TableRow>
                    ))}
                    {data.por_setor.length === 0 && (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-6">Sem dados.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display flex items-center gap-2">
                  <UserCog className="h-4 w-4 text-primary" /> Por Gestor
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Gestor</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Colab.</TableHead>
                      <TableHead className="text-right">Reincid.</TableHead>
                      <TableHead className="text-right">Susp.</TableHead>
                      <TableHead className="text-right">JC</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.por_gestor.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{r.gestor_nome}</TableCell>
                        <TableCell className="text-right">{r.total}</TableCell>
                        <TableCell className="text-right">{r.colaboradores_envolvidos}</TableCell>
                        <TableCell className="text-right">{r.reincidentes > 0 ? <Badge variant="destructive">{r.reincidentes}</Badge> : 0}</TableCell>
                        <TableCell className="text-right">{r.suspensoes}</TableCell>
                        <TableCell className="text-right">{r.justas_causas}</TableCell>
                      </TableRow>
                    ))}
                    {data.por_gestor.length === 0 && (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-6">Sem dados.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Reincidência por Colaborador
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>Gestor</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">AV</TableHead>
                    <TableHead className="text-right">AE</TableHead>
                    <TableHead className="text-right">Susp.</TableHead>
                    <TableHead className="text-right">JC</TableHead>
                    <TableHead className="text-right">Última</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.por_colaborador.map((r) => (
                    <TableRow key={r.colaborador_id}>
                      <TableCell className="font-medium">{r.nome_completo}</TableCell>
                      <TableCell>{r.setor}</TableCell>
                      <TableCell>{r.gestor_nome ?? '—'}</TableCell>
                      <TableCell className="text-right font-semibold">{r.total}</TableCell>
                      <TableCell className="text-right">{r.advertencia_verbal}</TableCell>
                      <TableCell className="text-right">{r.advertencia_escrita}</TableCell>
                      <TableCell className="text-right">{r.suspensao}</TableCell>
                      <TableCell className="text-right">{r.justa_causa}</TableCell>
                      <TableCell className="text-right">{r.ultima_ocorrencia}</TableCell>
                      <TableCell className="text-center">
                        {r.reincidente ? <Badge variant="destructive">Reincidente</Badge> : <Badge variant="outline">OK</Badge>}
                      </TableCell>
                    </TableRow>
                  ))}
                  {data.por_colaborador.length === 0 && (
                    <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground py-6">Sem medidas no período.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
