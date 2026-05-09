import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock, FileText, History, Info, ExternalLink, Calendar, MapPin, Shield, Search, Download } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export function PontoAdjustmentRequests() {
  const { empresaAtual } = useEmpresas();
  const queryClient = useQueryClient();
  const [selectedAudit, setSelectedAudit] = useState<any[] | null>(null);
  const [search, setSearch] = useState("");

  const { data: solicitacoes = [], isLoading } = useQuery({
    queryKey: ['solicitacoes-ajuste-ponto', empresaAtual?.id],
    queryFn: async () => {
      if (!empresaAtual?.id) return [];
      const { data, error } = await supabase
        .from('solicitacoes_ajuste_ponto')
        .select('*, colaborador:colaboradores(nome_completo)')
        .eq('empresa_id', empresaAtual.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaAtual?.id,
  });

  const { data: auditLogs = [] } = useQuery({
    queryKey: ['trilha-auditoria-ponto', empresaAtual?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trilha_auditoria_ponto')
        .select('*, batidas_ponto!inner(colaborador_id)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaAtual?.id,
  });

  const mutation = useMutation({
    mutationFn: async ({ id, status, observacoes }: { id: string, status: string, observacoes?: string }) => {
      const { error: updateError } = await supabase
        .from('solicitacoes_ajuste_ponto')
        .update({ 
          status, 
          observacoes_gestor: observacoes, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (updateError) throw updateError;

      if (status === 'aprovado') {
        const { error: applyError } = await supabase.rpc('processar_ajuste_aprovado', {
          p_solicitacao_id: id
        });
        if (applyError) throw applyError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-ajuste-ponto'] });
      toast.success('Solicitação atualizada com sucesso!');
    },
    onError: (e: any) => {
      toast.error(`Erro: ${e.message}`);
    }
  });

  const showAudit = (solicitacao: any) => {
    const logs = auditLogs.filter((log: any) => log.ponto_id === solicitacao.id);
    setSelectedAudit(logs);
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <>
      <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden mt-6">
        <div className="h-[2px] bg-gradient-to-r from-warning to-warning-glow" />
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <CardTitle className="font-display flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" /> Solicitações de Ajuste
            </CardTitle>
            <Badge variant="outline" className="text-[10px]">{solicitacoes.filter((s:any) => s.status === 'pendente').length} Pendentes</Badge>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              placeholder="Buscar colaborador..." 
              className="pl-8 h-8 text-xs" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>Colaborador</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Sugestão</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {solicitacoes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhuma solicitação pendente
                  </TableCell>
                </TableRow>
              ) : (
                solicitacoes
                  .filter((s: any) => s.colaborador?.nome_completo.toLowerCase().includes(search.toLowerCase()))
                  .map((s: any) => (
                    <TableRow key={s.id} className="group transition-colors hover:bg-muted/10">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{s.colaborador?.nome_completo}</span>
                          {s.relatorio_conformidade?.portaria_671_conformidade && (
                            <span className="text-[9px] text-success flex items-center gap-0.5 mt-0.5">
                              <Shield className="h-2.5 w-2.5" /> Validado Portaria 671
                            </span>
                          )}
                        </div>
                      </TableCell>
                    <TableCell>{new Date(s.data_ponto).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{s.tipo_ponto}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{s.hora_sugerida?.substring(0, 5)}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground" title={s.motivo}>{s.motivo}</TableCell>
                    <TableCell>
                      <Badge variant={s.status === 'pendente' ? 'secondary' : s.status === 'aprovado' ? 'success' : 'destructive'} className="capitalize text-[10px]">
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => showAudit(s)}>
                                <History className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Trilha de Auditoria</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {s.status === 'pendente' && (
                          <>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-success hover:bg-success/10" onClick={() => mutation.mutate({ id: s.id, status: 'aprovado' })}>
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => mutation.mutate({ id: s.id, status: 'rejeitado' })}>
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedAudit} onOpenChange={() => setSelectedAudit(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" /> Trilha de Auditoria Detalhada
            </DialogTitle>
            <DialogDescription>Histórico completo de alterações para este registro de ponto.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-muted">
              {selectedAudit && selectedAudit.length > 0 ? (
                selectedAudit.map((log, index) => (
                  <div key={log.id} className="relative pl-8">
                    <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background z-10" />
                    <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs capitalize text-primary">{log.acao}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {new Date(log.created_at).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{log.justificativa || 'Sem justificativa adicional'}</p>
                      {log.dados_novos && (
                        <div className="grid grid-cols-2 gap-2 p-2 bg-background/50 rounded-lg border border-border/30">
                          <div className="text-[10px]">
                            <p className="text-muted-foreground font-bold uppercase">Anterior</p>
                            <p className="font-mono">{JSON.stringify(log.dados_anteriores).substring(0, 50)}...</p>
                          </div>
                          <div className="text-[10px]">
                            <p className="text-primary font-bold uppercase">Novo</p>
                            <p className="font-mono text-primary">{JSON.stringify(log.dados_novos).substring(0, 50)}...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Info className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm">Nenhum log histórico encontrado para este ajuste.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
