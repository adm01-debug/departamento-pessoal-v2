import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks/useEmpresas';
import {
  contratoTemplateService,
  type ContratoGerado,
} from '@/services/contratoTemplateService';
import { toast } from 'sonner';
import {
  Copy,
  Download,
  ExternalLink,
  FileText,
  ShieldCheck,
  Search,
  RefreshCw,
  FileSpreadsheet,
  Send,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type StatusFilter = 'todos' | ContratoGerado['status'];

const STATUS_META: Record<
  ContratoGerado['status'],
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  rascunho: { label: 'Rascunho', variant: 'outline' },
  gerado: { label: 'Gerado', variant: 'secondary' },
  enviado: { label: 'Enviado', variant: 'default' },
  assinado: { label: 'Assinado', variant: 'default' },
  cancelado: { label: 'Cancelado', variant: 'destructive' },
};

interface ColaboradorLite {
  id: string;
  nome_completo: string | null;
  cpf: string | null;
}

export default function ContratosGeradosPage() {
  const { empresaAtual } = useEmpresas();
  const [contratos, setContratos] = useState<ContratoGerado[]>([]);
  const [colaboradores, setColaboradores] = useState<Record<string, ColaboradorLite>>({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<StatusFilter>('todos');
  const [busca, setBusca] = useState('');

  const carregar = async () => {
    if (!empresaAtual) return;
    setLoading(true);
    try {
      const gerados = await contratoTemplateService.listarGerados(empresaAtual.id);
      setContratos(gerados);
      const ids = Array.from(
        new Set(gerados.map((g) => g.colaborador_id).filter((v): v is string => !!v)),
      ).slice(0, 500);
      if (ids.length) {
        const { data } = await supabase
          .from('colaboradores')
          .select('id, nome_completo, cpf')
          .in('id', ids)
          .limit(500);
        const map: Record<string, ColaboradorLite> = {};
        (data ?? []).forEach((c) => {
          map[c.id] = c as ColaboradorLite;
        });
        setColaboradores(map);
      }
    } catch (e) {
      console.error('[contratos-gerados]', e);
      toast.error('Falha ao carregar contratos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empresaAtual?.id]);

  const filtrados = useMemo(() => {
    const term = busca.trim().toLowerCase();
    return contratos.filter((c) => {
      if (status !== 'todos' && c.status !== status) return false;
      if (term) {
        const col = c.colaborador_id ? colaboradores[c.colaborador_id] : undefined;
        const alvo = `${col?.nome_completo ?? ''} ${col?.cpf ?? ''} ${c.sha256 ?? ''}`.toLowerCase();
        if (!alvo.includes(term)) return false;
      }
      return true;
    });
  }, [contratos, status, busca, colaboradores]);

  const kpis = useMemo(() => {
    const total = contratos.length;
    const assinados = contratos.filter((c) => c.status === 'assinado').length;
    const enviados = contratos.filter((c) => c.status === 'enviado').length;
    const conversao = enviados + assinados > 0 ? Math.round((assinados / (enviados + assinados)) * 100) : 0;
    return { total, assinados, enviados, conversao };
  }, [contratos]);

  const copiarLinkVerificacao = async (hash: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/verificar-contrato/${hash}`);
    toast.success('Link de verificação copiado');
  };

  const baixarPdf = async (path: string) => {
    try {
      const url = await contratoTemplateService.downloadUrl(path);
      window.open(url, '_blank', 'noopener');
    } catch (e) {
      console.error('[download-contrato]', e);
      toast.error('Não foi possível gerar o link de download');
    }
  };

  const reenviarLink = async (contratoId: string) => {
    try {
      const { url } = await contratoTemplateService.gerarTokenAssinatura(contratoId, { validadeDias: 7 });
      await navigator.clipboard.writeText(url);
      toast.success('Novo link gerado e copiado (válido por 7 dias)');
      void carregar();
    } catch (e) {
      console.error('[reenviar-link]', e);
      toast.error('Falha ao gerar link de assinatura');
    }
  };

  const exportarCsv = () => {
    if (!filtrados.length) {
      toast.error('Nenhum contrato para exportar');
      return;
    }
    const headers = [
      'Colaborador',
      'CPF',
      'Status',
      'Gerado em',
      'Assinado em',
      'Hash SHA-256',
      'Link Público',
    ];
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const linhas = filtrados.map((c) => {
      const col = c.colaborador_id ? colaboradores[c.colaborador_id] : undefined;
      const linkPublico = c.sha256 && c.status === 'assinado'
        ? `${window.location.origin}/verificar-contrato/${c.sha256}`
        : '';
      return [
        col?.nome_completo ?? '',
        col?.cpf ?? '',
        STATUS_META[c.status].label,
        format(new Date(c.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
        c.assinado_em ? format(new Date(c.assinado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : '',
        c.sha256 ?? '',
        linkPublico,
      ].map(escape).join(';');
    });
    const csv = '\uFEFF' + [headers.map(escape).join(';'), ...linhas].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contratos-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filtrados.length} contrato(s) exportado(s)`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" /> Contratos Gerados
          </h1>
          <p className="text-muted-foreground text-sm">
            Auditoria e acompanhamento de contratos emitidos, assinados e verificáveis publicamente.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportarCsv} disabled={loading || !filtrados.length}>
            <FileSpreadsheet className="h-4 w-4 mr-2" /> Exportar CSV
          </Button>
          <Button variant="outline" onClick={() => void carregar()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Atualizar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total</CardDescription>
            <CardTitle className="text-3xl">{kpis.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Assinados</CardDescription>
            <CardTitle className="text-3xl text-primary">{kpis.assinados}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Aguardando assinatura</CardDescription>
            <CardTitle className="text-3xl">{kpis.enviados}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Conversão</CardDescription>
            <CardTitle className="text-3xl">{kpis.conversao}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, CPF ou hash"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              {(['todos', 'rascunho', 'gerado', 'enviado', 'assinado', 'cancelado'] as const).map(
                (s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={status === s ? 'default' : 'outline'}
                    onClick={() => setStatus(s)}
                  >
                    {s === 'todos' ? 'Todos' : STATUS_META[s].label}
                  </Button>
                ),
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filtrados.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-10">
              Nenhum contrato encontrado com os filtros atuais.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Gerado em</TableHead>
                    <TableHead>Assinado em</TableHead>
                    <TableHead className="font-mono text-xs">Hash</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtrados.map((c) => {
                    const col = c.colaborador_id ? colaboradores[c.colaborador_id] : undefined;
                    return (
                      <TableRow key={c.id}>
                        <TableCell>
                          <div className="font-medium">{col?.nome_completo ?? '—'}</div>
                          <div className="text-[11px] text-muted-foreground font-mono">
                            {col?.cpf ?? ''}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={STATUS_META[c.status].variant}>
                            {STATUS_META[c.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {format(new Date(c.created_at), "dd/MM/yy HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-xs">
                          {c.assinado_em
                            ? format(new Date(c.assinado_em), "dd/MM/yy HH:mm", { locale: ptBR })
                            : '—'}
                        </TableCell>
                        <TableCell className="font-mono text-[10px]">
                          {c.sha256 ? `${c.sha256.substring(0, 12)}…` : '—'}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          {c.storage_path && (
                            <Button
                              size="icon"
                              variant="ghost"
                              title="Baixar PDF"
                              onClick={() => void baixarPdf(c.storage_path!)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          {(c.status === 'gerado' || c.status === 'enviado') && (
                            <Button
                              size="icon"
                              variant="ghost"
                              title="Gerar/reenviar link de assinatura"
                              onClick={() => void reenviarLink(c.id)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          {c.status === 'assinado' && c.sha256 && (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                title="Copiar link de verificação"
                                onClick={() => void copiarLinkVerificacao(c.sha256!)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                title="Abrir portal público"
                                asChild
                              >
                                <a
                                  href={`/verificar-contrato/${c.sha256}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center">
        <ShieldCheck className="h-3 w-3" /> Contratos assinados possuem verificação pública por hash
        SHA-256 (MP 2.200-2/2001)
      </p>
    </div>
  );
}
