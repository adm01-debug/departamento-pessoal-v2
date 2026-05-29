import { PageTitle } from '@/components/PageTitle';
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { TableSkeleton } from '@/components/ui/module-skeleton';
import { MedidasKPIs, MedidasTimeline, MedidasTable, MedidasGravityScale } from '@/components/medidas-disciplinares';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { medidasDisciplinaresService } from '@/services';
import { colaboradorService } from '@/services';
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';
import { Plus, AlertTriangle, Scale, Users } from 'lucide-react';

const tipoLabels: Record<string, string> = {
  advertencia_verbal: 'Advertência Verbal',
  advertencia_escrita: 'Advertência Escrita',
  suspensao: 'Suspensão',
  justa_causa: 'Justa Causa',
};

const tipoOptions = Object.entries(tipoLabels).map(([value, label]) => ({ value, label }));

const artigosCLT = [
  { value: 'art_482_a', label: 'Art. 482, a - Ato de improbidade' },
  { value: 'art_482_b', label: 'Art. 482, b - Incontinência de conduta' },
  { value: 'art_482_c', label: 'Art. 482, c - Negociação habitual' },
  { value: 'art_482_d', label: 'Art. 482, d - Condenação criminal' },
  { value: 'art_482_e', label: 'Art. 482, e - Desídia' },
  { value: 'art_482_f', label: 'Art. 482, f - Embriaguez habitual' },
  { value: 'art_482_g', label: 'Art. 482, g - Violação de segredo' },
  { value: 'art_482_h', label: 'Art. 482, h - Indisciplina' },
  { value: 'art_482_i', label: 'Art. 482, i - Insubordinação' },
  { value: 'art_482_j', label: 'Art. 482, j - Abandono de emprego' },
  { value: 'art_482_k', label: 'Art. 482, k - Ato lesivo à honra' },
  { value: 'outro', label: 'Outro' },
];

const initialForm = {
  colaborador_id: '', tipo: 'advertencia_verbal', data_ocorrencia: '', descricao: '',
  dias_suspensao: '', artigo_clt: '', testemunha_1_nome: '', testemunha_1_cpf: '',
  testemunha_2_nome: '', testemunha_2_cpf: '', documento_url: '', recusa_assinatura: false,
  motivo_recusa: '',
};

export default function MedidasDisciplinaresPage() {
  const { empresaAtual } = useEmpresas();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');

  const { data: medidas = [], isLoading } = useQuery({
    queryKey: ['medidas-disciplinares', empresaAtual?.id],
    queryFn: () => medidasDisciplinaresService.listar(empresaAtual?.id),
    enabled: !!empresaAtual?.id,
  });

  const { data: colaboradores = [] } = useQuery({
    queryKey: ['colaboradores', empresaAtual?.id],
    queryFn: () => colaboradorService.list(empresaAtual?.id),
    enabled: !!empresaAtual?.id,
  });

  const criar = useMutation({
    mutationFn: (d: Record<string, unknown>) => medidasDisciplinaresService.criar({
      ...d,
      empresa_id: empresaAtual?.id,
      dias_suspensao: d.dias_suspensao ? Number(d.dias_suspensao) : null,
      artigo_clt: d.artigo_clt || null,
      testemunha_1_nome: d.testemunha_1_nome || null,
      testemunha_1_cpf: d.testemunha_1_cpf || null,
      testemunha_2_nome: d.testemunha_2_nome || null,
      testemunha_2_cpf: d.testemunha_2_cpf || null,
      documento_url: d.documento_url || null,
      recusa_assinatura: d.recusa_assinatura || false,
      motivo_recusa: d.motivo_recusa || null,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['medidas-disciplinares'] });
      setOpen(false);
      setForm(initialForm);
      toast.success('Medida registrada com sucesso!');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const marcarCiencia = useMutation({
    mutationFn: (id: string) => medidasDisciplinaresService.atualizar(id, {
      colaborador_ciente: true,
      data_ciencia: new Date().toISOString(),
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['medidas-disciplinares'] });
      toast.success('Ciência registrada!');
    },
  });

  const excluir = useMutation({
    mutationFn: (id: string) => medidasDisciplinaresService.excluir(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['medidas-disciplinares'] });
      toast.success('Registro excluído!');
    },
  });

  const filtered = useMemo(() => medidas.filter((m: any) => {
    if (tipoFilter && tipoFilter !== 'all' && m.tipo !== tipoFilter) return false;
    if (search) {
      const nome = (m.colaborador?.nome_completo || '').toLowerCase();
      if (!nome.includes(search.toLowerCase())) return false;
    }
    return true;
  }), [medidas, tipoFilter, search]);

  const stats = useMemo(() => ({
    total: medidas.length,
    advertenciasVerbais: medidas.filter((m: any) => m.tipo === 'advertencia_verbal').length,
    advertenciasEscritas: medidas.filter((m: any) => m.tipo === 'advertencia_escrita').length,
    suspensoes: medidas.filter((m: any) => m.tipo === 'suspensao').length,
    justaCausa: medidas.filter((m: any) => m.tipo === 'justa_causa').length,
    pendenteCiencia: medidas.filter((m: any) => !m.colaborador_ciente && !m.recusa_assinatura).length,
    recusas: medidas.filter((m: any) => m.recusa_assinatura).length,
    ultimosMeses: medidas.filter((m: any) => {
      const d = new Date(m.data_ocorrencia);
      const now = new Date();
      return d >= new Date(now.getFullYear(), now.getMonth() - 3, 1);
    }).length,
  }), [medidas]);

  return (
    <>
    <PageTitle title="Medidas Disciplinares" description="Controle de medidas disciplinares" />
    <PageLayout
      title="Medidas Disciplinares"
      description="Advertências, suspensões e ações disciplinares com embasamento legal CLT"
      icon={<AlertTriangle className="h-5 w-5 text-primary-foreground" />}
      gradient="from-destructive to-warning"
    >
      <MedidasKPIs stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <MedidasTimeline medidas={medidas} onMarcarCiencia={(id) => marcarCiencia.mutate(id)} />
        </div>
        <div>
          <MedidasGravityScale medidas={medidas} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <DataTableToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar colaborador..."
          filters={[{ key: 'tipo', label: 'Tipo', options: tipoOptions, value: tipoFilter, onChange: setTipoFilter }]}
          onClearFilters={() => { setTipoFilter(''); setSearch(''); }}
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-xl shrink-0">
              <Plus className="h-4 w-4 mr-1" />Nova Medida
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">Registrar Medida Disciplinar</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Colaborador *</Label>
                <Select value={form.colaborador_id} onValueChange={v => setForm(p => ({ ...p, colaborador_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione o colaborador" /></SelectTrigger>
                  <SelectContent>
                    {colaboradores.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tipo *</Label>
                <Select value={form.tipo} onValueChange={v => setForm(p => ({ ...p, tipo: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(tipoLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Data Ocorrência *</Label>
                <Input type="date" value={form.data_ocorrencia} onChange={e => setForm(p => ({ ...p, data_ocorrencia: e.target.value }))} />
              </div>

              {form.tipo === 'suspensao' && (
                <div>
                  <Label>Dias de Suspensão (máx. 30 dias — CLT Art. 474)</Label>
                  <Input type="number" min={1} max={30} value={form.dias_suspensao} onChange={e => setForm(p => ({ ...p, dias_suspensao: e.target.value }))} />
                </div>
              )}

              <div className="space-y-3 p-3 rounded-xl bg-muted/50 border border-border/30">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Scale className="h-4 w-4" /> Embasamento Legal
                </div>
                <div>
                  <Label>Artigo CLT</Label>
                  <Select value={form.artigo_clt} onValueChange={v => setForm(p => ({ ...p, artigo_clt: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione o artigo" /></SelectTrigger>
                    <SelectContent>
                      {artigosCLT.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3 p-3 rounded-xl bg-muted/50 border border-border/30">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Users className="h-4 w-4" /> Testemunhas
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Nome 1</Label><Input value={form.testemunha_1_nome} onChange={e => setForm(p => ({ ...p, testemunha_1_nome: e.target.value }))} /></div>
                  <div><Label>CPF 1</Label><Input value={form.testemunha_1_cpf} onChange={e => setForm(p => ({ ...p, testemunha_1_cpf: e.target.value }))} placeholder="000.000.000-00" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Nome 2</Label><Input value={form.testemunha_2_nome} onChange={e => setForm(p => ({ ...p, testemunha_2_nome: e.target.value }))} /></div>
                  <div><Label>CPF 2</Label><Input value={form.testemunha_2_cpf} onChange={e => setForm(p => ({ ...p, testemunha_2_cpf: e.target.value }))} placeholder="000.000.000-00" /></div>
                </div>
              </div>

              <div>
                <Label>URL Documento Assinado</Label>
                <Input value={form.documento_url} onChange={e => setForm(p => ({ ...p, documento_url: e.target.value }))} placeholder="https://..." />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={form.recusa_assinatura}
                  onCheckedChange={(c) => setForm(p => ({ ...p, recusa_assinatura: !!c }))}
                />
                <Label className="cursor-pointer">Colaborador recusou assinar</Label>
              </div>
              {form.recusa_assinatura && (
                <div>
                  <Label>Motivo da Recusa *</Label>
                  <Textarea value={form.motivo_recusa} onChange={e => setForm(p => ({ ...p, motivo_recusa: e.target.value }))} placeholder="Descreva o motivo da recusa para segurança jurídica" />
                </div>
              )}

              <div>
                <Label>Descrição da Ocorrência *</Label>
                <Textarea value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))} placeholder="Descreva detalhadamente a ocorrência..." rows={4} />
              </div>

              <Button
                className="w-full rounded-xl"
                onClick={() => criar.mutate(form)}
                disabled={!form.colaborador_id || !form.data_ocorrencia || !form.descricao}
              >
                Registrar Medida Disciplinar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} columns={9} />
      ) : (
        <MedidasTable
          data={filtered}
          onMarcarCiencia={(id) => marcarCiencia.mutate(id)}
          onExcluir={(id) => excluir.mutate(id)}
        />
      )}
    </PageLayout>
    </>
  );
}
