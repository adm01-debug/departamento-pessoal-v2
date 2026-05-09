import { PageTitle } from '@/components/PageTitle';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileCheck, Send, AlertCircle, CheckCircle, Plus, Loader2, RefreshCw, ShieldCheck, Key, Eye, Info, Globe, AlertTriangle, Check, Search, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useESocial } from '@/hooks/useESocial';
import { useEmpresas } from '@/hooks/useEmpresas';
import { getEventoDescricao, validarAnteDeEnviar } from '@/services/esocialService';
import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const tiposEvento = [
  'S-1000', 'S-1005', 'S-1010', 'S-1020',
  'S-1200', 'S-1210', 'S-1280',
  'S-2200', 'S-2205', 'S-2206', 'S-2230', 'S-2299', 'S-2300', 'S-2399',
];

export default function ESocialPage() {
  const { eventos, stats, isLoading, criarEvento, enviarEvento, reenviarEvento, isSending } = useESocial();
  const { empresaAtual } = useEmpresas();
  const [novoTipo, setNovoTipo] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<any>(null);

  const statusVariant = (s: string) => s === 'enviado' ? 'success' : s === 'erro' ? 'error' : 'warning';
  const statusIcon = (s: string) => {
    if (s === 'enviado') return <CheckCircle className="h-5 w-5 text-success" />;
    if (s === 'erro') return <AlertCircle className="h-5 w-5 text-destructive" />;
    return <Send className="h-5 w-5 text-warning" />;
  };

  const formatDate = (d: string | null) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('pt-BR');
  };

  const handleCriar = () => {
    if (!novoTipo || !empresaAtual?.id) return;
    criarEvento({ empresa_id: empresaAtual.id, tipo_evento: novoTipo });
    setNovoTipo('');
    setDialogOpen(false);
  };

  const statsData = [
    { label: 'Eventos Enviados', value: String(stats.enviados), gradient: 'from-primary to-primary-glow' },
    { label: 'Pendentes', value: String(stats.pendentes), gradient: 'from-primary-glow to-primary' },
    { label: 'Com Erro', value: String(stats.erros), gradient: 'from-destructive to-destructive/70/70' },
    { label: 'Conformidade', value: `${stats.conformidade}%`, gradient: 'from-primary to-primary-glow' },
  ];

  return (
    <>
    <PageTitle title="eSocial" description="Gestão de eventos eSocial" />
    <PageLayout
      title="eSocial"
      description="Gestão de eventos eSocial"
      icon={<FileCheck className="h-5 w-5 text-primary-foreground" />}
      gradient="from-primary to-primary-glow"
    >
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {statsData.map(({ label, value, gradient }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden group hover:shadow-glow transition-all">
              <div className={cn("h-[2px] bg-gradient-to-r", gradient)} />
              <CardContent className="pt-6">
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-display font-bold">{value}</div>
                )}
                <p className="text-xs text-muted-foreground font-body mt-1">{label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Events */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
          <div className="h-[2px] bg-gradient-to-r from-primary to-primary-glow" />
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2.5 font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                <FileCheck className="h-4 w-4 text-primary-foreground" />
              </div>
              Eventos eSocial
            </CardTitle>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-xl gap-1.5 font-body border-success/30 hover:bg-success/5 text-success">
                    <ShieldCheck className="h-4 w-4" />
                    Certificado Ativo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-display">Gestão de Certificados Digitais</DialogTitle>
                    <CardDescription>Gerencie seus certificados ICP-Brasil (A1/A3)</CardDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="p-4 rounded-xl border border-success/20 bg-success/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Key className="h-8 w-8 text-success" />
                        <div>
                          <p className="font-bold text-sm">e-CNPJ: {empresaAtual?.razao_social}</p>
                          <p className="text-xs text-muted-foreground">Vencimento: 12/12/2026 (Em 224 dias)</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-success border-success/30">Válido</Badge>
                    </div>
                    <Button variant="outline" className="w-full rounded-xl border-dashed">
                      <Plus className="h-4 w-4 mr-2" /> Upload Novo Certificado (.pfx)
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="rounded-xl bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 text-primary-foreground font-body">
                  <Plus className="h-4 w-4 mr-1" /> Novo Evento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display">Criar Evento eSocial</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <Select value={novoTipo} onValueChange={setNovoTipo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de evento" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposEvento.map(t => (
                        <SelectItem key={t} value={t}>{t} - {getEventoDescricao(t)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleCriar} disabled={!novoTipo || !empresaAtual?.id} className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
                    Criar Evento
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
              </div>
            ) : eventos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground font-body">
                <FileCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum evento registrado</p>
                <p className="text-sm mt-1">Crie um novo evento para começar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {eventos.map((e, i) => (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.03 }}
                    className="flex items-center justify-between p-3.5 rounded-xl glass hover:border-border/60 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {statusIcon(e.status || 'pendente')}
                      <div>
                        <p className="font-body font-medium">
                          {e.tipo_evento} - {getEventoDescricao(e.tipo_evento)}
                        </p>
                        <p className="text-sm text-muted-foreground font-body">
                          {formatDate(e.data_envio || e.created_at)}
                          {e.protocolo && <span className="ml-2 text-xs opacity-70">Protocolo: {e.protocolo}</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={e.status || 'pendente'} variant={statusVariant(e.status || 'pendente') as any} />
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setSelectedEvento(e)} title="Ver detalhes">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {e.status === 'pendente' && empresaAtual?.id && (
                          <Button
                            size="sm"
                            disabled={isSending}
                            onClick={() => enviarEvento({ eventoId: e.id, empresaId: empresaAtual.id })}
                            className="rounded-xl bg-gradient-to-r from-primary-glow to-primary hover:opacity-90 text-primary-foreground font-body"
                          >
                            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-3 w-3 mr-1" /> Enviar</>}
                          </Button>
                        )}
                        {e.status === 'erro' && empresaAtual?.id && (
                          <Button
                            size="sm"
                            disabled={isSending}
                            onClick={() => reenviarEvento({ eventoId: e.id, empresaId: empresaAtual.id })}
                            className="rounded-xl bg-gradient-to-r from-destructive to-destructive/70/70 hover:opacity-90 text-primary-foreground font-body"
                          >
                            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><RefreshCw className="h-3 w-3 mr-1" /> Reenviar</>}
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      </PageLayout>

      {/* Detalhes do Evento */}
      <Dialog open={!!selectedEvento} onOpenChange={(o) => { if(!o) setSelectedEvento(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-border/30 shadow-elevated rounded-2xl">
          <DialogHeader className="p-6 pb-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-xl">
                <FileCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="font-display text-xl">{selectedEvento?.tipo_evento} - Detalhes da Transmissão</DialogTitle>
                <DialogDescription className="font-body">
                  Histórico de envio e retorno do eSocial
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 p-6 pt-2">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="bg-muted/30 border-none shadow-none">
                <CardContent className="p-4 flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Status</span>
                  <StatusBadge status={selectedEvento?.status || 'pendente'} variant={statusVariant(selectedEvento?.status || 'pendente') as any} />
                </CardContent>
              </Card>
              <Card className="bg-muted/30 border-none shadow-none">
                <CardContent className="p-4 flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Data de Envio</span>
                  <span className="text-sm font-medium">{formatDate(selectedEvento?.data_envio || selectedEvento?.created_at)}</span>
                </CardContent>
              </Card>
              <Card className="bg-muted/30 border-none shadow-none">
                <CardContent className="p-4 flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Recibo / Protocolo</span>
                  <span className="text-sm font-mono">{selectedEvento?.protocolo || 'Aguardando transmissão'}</span>
                </CardContent>
              </Card>
              <Card className="bg-muted/30 border-none shadow-none">
                <CardContent className="p-4 flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Ambiente</span>
                  <Badge variant="outline" className="w-fit flex gap-1 items-center"><Globe className="h-3 w-3" /> Produção</Badge>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {selectedEvento?.mensagem_erro && (
                <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-sm font-body">
                  <p className="font-bold flex items-center gap-1.5 mb-1"><AlertCircle className="h-4 w-4" /> Erro na Transmissão:</p>
                  {selectedEvento.mensagem_erro}
                </div>
              )}

              <div>
                <Label className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1.5 block">Dados do Evento (JSON)</Label>
                <pre className="text-[10px] p-4 bg-muted rounded-xl border font-mono max-h-[300px] overflow-auto">
                  {JSON.stringify(selectedEvento?.dados_evento || {}, null, 2)}
                </pre>
              </div>
            </div>
          </ScrollArea>
          
          <div className="p-4 bg-muted/20 border-t border-border/20 flex justify-end">
            <Button variant="outline" onClick={() => setSelectedEvento(null)} className="rounded-xl">Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}