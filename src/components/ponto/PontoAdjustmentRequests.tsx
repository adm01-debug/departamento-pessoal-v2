import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock, FileText, History, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';

export function PontoAdjustmentRequests() {
  const { empresaAtual } = useEmpresas();
  const queryClient = useQueryClient();

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

  const mutation = useMutation({
    mutationFn: async ({ id, status, observacoes }: { id: string, status: string, observacoes?: string }) => {
      const { error } = await supabase
        .from('solicitacoes_ajuste_ponto')
        .update({ status, observacoes_gestor: observacoes, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-ajuste-ponto'] });
      toast.success('Solicitação atualizada com sucesso!');
    },
    onError: (e: any) => {
      toast.error(`Erro: ${e.message}`);
    }
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden mt-6">
      <div className="h-[2px] bg-gradient-to-r from-warning to-warning-glow" />
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Clock className="h-4 w-4 text-warning" /> Solicitações de Ajuste
        </CardTitle>
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
              solicitacoes.map((s: any) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.colaborador?.nome_completo}</TableCell>
                  <TableCell>{new Date(s.data_ponto).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell><Badge variant="outline">{s.tipo_ponto}</Badge></TableCell>
                  <TableCell className="font-mono">{s.hora_sugerida?.substring(0, 5)}</TableCell>
                  <TableCell className="max-w-xs truncate">{s.motivo}</TableCell>
                  <TableCell>
                    <Badge variant={s.status === 'pendente' ? 'secondary' : s.status === 'aprovado' ? 'success' : 'destructive'} className="capitalize">
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" onClick={() => toast.info(`Trilha de Auditoria: Criado em ${new Date(s.created_at).toLocaleString('pt-BR')}`)}>
                              <History className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Ver Auditoria</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {s.status === 'pendente' && (
                        <>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-success" onClick={() => mutation.mutate({ id: s.id, status: 'aprovado' })}>
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => mutation.mutate({ id: s.id, status: 'rejeitado' })}>
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
  );
}
