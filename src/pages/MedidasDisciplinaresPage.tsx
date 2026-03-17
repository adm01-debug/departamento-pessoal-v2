import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { medidasDisciplinaresService } from '@/services';
import { colaboradorService } from '@/services';
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';
import { Plus, AlertTriangle, Trash2, Scale, Users, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const tipoLabels: Record<string, string> = {
  advertencia_verbal: 'Advertência Verbal',
  advertencia_escrita: 'Advertência Escrita',
  suspensao: 'Suspensão',
  justa_causa: 'Justa Causa',
};

const gravidade: Record<string, 'secondary' | 'default' | 'destructive'> = {
  advertencia_verbal: 'secondary',
  advertencia_escrita: 'default',
  suspensao: 'destructive',
  justa_causa: 'destructive',
};

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
    mutationFn: (d: any) => medidasDisciplinaresService.criar({
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
      toast.success('Medida registrada!');
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
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['medidas-disciplinares'] }); toast.success('Registro excluído!'); },
  });

  if (isLoading) return <PageLayout title="Medidas Disciplinares"><Spinner /></PageLayout>;

  return (
    <PageLayout
      title="Medidas Disciplinares"
      description="Advertências, suspensões e ações disciplinares com embasamento legal"
      icon={<AlertTriangle className="h-5 w-5 text-white" />}
      gradient="from-destructive to-warning"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(tipoLabels).map(([k, label], i) => (
          <motion.div key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border border-border/30 shadow-elevated rounded-2xl">
              <CardContent className="pt-4 text-center">
                <p className="text-2xl font-display font-bold">{medidas.filter((m: any) => m.tipo === k).length}</p>
                <p className="text-sm text-muted-foreground font-body">{label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
        <div className="h-[2px] bg-gradient-to-r from-destructive to-warning" />
        <CardContent className="pt-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-display font-semibold">Registros</h3>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="rounded-xl"><Plus className="h-4 w-4 mr-1" />Nova Medida</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader><DialogTitle className="font-display">Registrar Medida Disciplinar</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Colaborador *</Label>
                    <Select value={form.colaborador_id} onValueChange={v => setForm(p => ({ ...p, colaborador_id: v }))}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{colaboradores.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tipo *</Label>
                    <Select value={form.tipo} onValueChange={v => setForm(p => ({ ...p, tipo: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{Object.entries(tipoLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Data Ocorrência *</Label><Input type="date" value={form.data_ocorrencia} onChange={e => setForm(p => ({ ...p, data_ocorrencia: e.target.value }))} /></div>

                  {form.tipo === 'suspensao' && (
                    <div><Label>Dias de Suspensão</Label><Input type="number" value={form.dias_suspensao} onChange={e => setForm(p => ({ ...p, dias_suspensao: e.target.value }))} /></div>
                  )}

                  {/* Embasamento Legal */}
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

                  {/* Testemunhas */}
                  <div className="space-y-3 p-3 rounded-xl bg-muted/50 border border-border/30">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Users className="h-4 w-4" /> Testemunhas
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Nome Testemunha 1</Label><Input value={form.testemunha_1_nome} onChange={e => setForm(p => ({ ...p, testemunha_1_nome: e.target.value }))} /></div>
                      <div><Label>CPF Testemunha 1</Label><Input value={form.testemunha_1_cpf} onChange={e => setForm(p => ({ ...p, testemunha_1_cpf: e.target.value }))} placeholder="000.000.000-00" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Nome Testemunha 2</Label><Input value={form.testemunha_2_nome} onChange={e => setForm(p => ({ ...p, testemunha_2_nome: e.target.value }))} /></div>
                      <div><Label>CPF Testemunha 2</Label><Input value={form.testemunha_2_cpf} onChange={e => setForm(p => ({ ...p, testemunha_2_cpf: e.target.value }))} placeholder="000.000.000-00" /></div>
                    </div>
                  </div>

                  <div><Label>URL Documento Assinado</Label><Input value={form.documento_url} onChange={e => setForm(p => ({ ...p, documento_url: e.target.value }))} placeholder="https://..." /></div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={form.recusa_assinatura}
                      onCheckedChange={(c) => setForm(p => ({ ...p, recusa_assinatura: !!c }))}
                    />
                    <Label className="cursor-pointer">Colaborador recusou assinar</Label>
                  </div>
                  {form.recusa_assinatura && (
                    <div><Label>Motivo da Recusa</Label><Textarea value={form.motivo_recusa} onChange={e => setForm(p => ({ ...p, motivo_recusa: e.target.value }))} /></div>
                  )}

                  <div><Label>Descrição *</Label><Textarea value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))} /></div>
                  <Button className="w-full rounded-xl" onClick={() => criar.mutate(form)} disabled={!form.colaborador_id || !form.data_ocorrencia || !form.descricao}>Salvar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-display font-semibold">Nº</TableHead>
                <TableHead className="font-display font-semibold">Colaborador</TableHead>
                <TableHead className="font-display font-semibold">Tipo</TableHead>
                <TableHead className="font-display font-semibold">Data</TableHead>
                <TableHead className="font-display font-semibold">Artigo CLT</TableHead>
                <TableHead className="font-display font-semibold">Testemunhas</TableHead>
                <TableHead className="font-display font-semibold">Ciência</TableHead>
                <TableHead className="font-display font-semibold">Descrição</TableHead>
                <TableHead className="font-display font-semibold w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medidas.map((m: any) => (
                <TableRow key={m.id} className="hover:bg-accent/30 transition-colors">
                  <TableCell className="font-body font-mono text-sm">#{m.numero_sequencial || '—'}</TableCell>
                  <TableCell className="font-body font-medium">{m.colaborador?.nome_completo || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={gravidade[m.tipo] || 'secondary'} className="text-xs">
                      {tipoLabels[m.tipo] || m.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-body text-sm">{m.data_ocorrencia}</TableCell>
                  <TableCell className="font-body text-xs">{m.artigo_clt ? artigosCLT.find(a => a.value === m.artigo_clt)?.label || m.artigo_clt : '—'}</TableCell>
                  <TableCell className="font-body text-xs">
                    {m.testemunha_1_nome ? (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span>{[m.testemunha_1_nome, m.testemunha_2_nome].filter(Boolean).length}</span>
                      </div>
                    ) : '—'}
                  </TableCell>
                  <TableCell>
                    {m.colaborador_ciente ? (
                      <Badge variant="secondary" className="text-xs gap-1"><FileText className="h-3 w-3" />Ciente</Badge>
                    ) : m.recusa_assinatura ? (
                      <Badge variant="destructive" className="text-xs">Recusou</Badge>
                    ) : (
                      <Button size="sm" variant="outline" className="h-6 text-xs rounded-lg" onClick={() => marcarCiencia.mutate(m.id)}>
                        Registrar
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate font-body text-sm">{m.descricao}</TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg" onClick={() => excluir.mutate(m.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {medidas.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8 font-body">Nenhuma medida registrada</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
