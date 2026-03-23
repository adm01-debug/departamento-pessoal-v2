import { PageTitle } from '@/components/PageTitle';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileCheck, Send, AlertCircle, CheckCircle, Plus, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useESocial } from '@/hooks/useESocial';
import { useEmpresas } from '@/hooks/useEmpresas';
import { getEventoDescricao } from '@/services/esocialService';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

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
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </PageLayout>
    </>
  );
}
