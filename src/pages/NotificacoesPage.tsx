import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { EmptyList } from '@/components/ui/empty-state';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Check, CheckCheck, Info, AlertTriangle, CheckCircle, AlertCircle, History } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const tipoIcon: Record<string, React.ElementType> = {
  info: Info, alerta: AlertTriangle, sucesso: CheckCircle, erro: AlertCircle,
};
const tipoGradient: Record<string, string> = {
  info: 'from-primary to-primary-glow', alerta: 'from-primary-glow to-primary', sucesso: 'from-primary to-primary-glow', erro: 'from-destructive to-destructive/70',
};

const nivelColors: Record<string, string> = {
  atencao: 'bg-warning/15 text-warning', critico: 'bg-destructive/15 text-destructive', info: 'bg-info/15 text-info',
};

export default function NotificacoesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('notificacoes');

  const { data: notificacoes, isLoading } = useQuery({
    queryKey: ['notificacoes-db', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase.from('notificacoes').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      return data || [];
    },
  });

  const marcarLida = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notificacoes').update({ lida: true }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notificacoes-db'] }),
  });

  const marcarTodasLidas = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('notificacoes').update({ lida: true }).eq('user_id', user!.id).eq('lida', false);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['notificacoes-db'] }); toast.success('Todas marcadas como lidas'); },
  });

  // === Histórico de Alertas ===
  const { data: historicoAlertas = [], isLoading: loadAlertas } = useQuery({
    queryKey: ['historico-alertas'],
    queryFn: async () => {
      const { data, error } = await supabase.from('historico_alertas' as any).select('*').order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      return data || [];
    },
  });

  const naoLidas = notificacoes?.filter((n: any) => !n.lida).length || 0;

  return (
    <PageLayout title="Notificações" description={`${naoLidas} não lida${naoLidas !== 1 ? 's' : ''}`} icon={<Bell className="h-5 w-5 text-primary-foreground" />} gradient="from-primary/60 to-primary/90"
      actions={naoLidas > 0 ? <Button variant="outline" onClick={() => marcarTodasLidas.mutate()} className="rounded-xl font-body"><CheckCheck className="h-4 w-4 mr-2" />Marcar todas como lidas</Button> : undefined}
    >
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="notificacoes"><Bell className="mr-1 h-4 w-4" />Notificações</TabsTrigger>
          <TabsTrigger value="historico"><History className="mr-1 h-4 w-4" />Histórico de Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="notificacoes">
          {isLoading ? (
            <div className="flex justify-center p-8"><Spinner size="lg" /></div>
          ) : !notificacoes?.length ? (
            <EmptyList entityName="notificação" />
          ) : (
            <div className="space-y-2 max-w-3xl">
              {notificacoes.map((n: any, i: number) => {
                const Icon = tipoIcon[n.tipo] || Info;
                const gradient = tipoGradient[n.tipo] || 'from-primary to-primary-glow';
                return (
                  <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <Card className={cn('border border-border/30 rounded-xl transition-all hover:shadow-elevated', !n.lida && 'border-l-4 border-l-primary bg-primary/[0.02]')}>
                      <CardContent className="flex items-start gap-3 p-4">
                        <div className={cn('p-2 rounded-xl bg-gradient-to-br shrink-0', gradient)}>
                          <Icon className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-medium text-sm">{n.titulo}</p>
                          {n.mensagem && <p className="text-muted-foreground font-body text-xs mt-0.5">{n.mensagem}</p>}
                          <p className="text-muted-foreground/60 font-body text-[11px] mt-1">{new Date(n.created_at).toLocaleString('pt-BR')}</p>
                        </div>
                        {!n.lida && (
                          <Button variant="ghost" size="icon" className="rounded-lg shrink-0 h-8 w-8" onClick={() => marcarLida.mutate(n.id)}>
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="historico">
          <Card><CardContent className="p-0">
            {loadAlertas ? <div className="p-8 flex justify-center"><Spinner /></div> : (
              <Table>
                <TableHeader><TableRow><TableHead>Tipo</TableHead><TableHead>Mensagem</TableHead><TableHead>Nível</TableHead><TableHead>Valor</TableHead><TableHead>Limite</TableHead><TableHead>Data</TableHead></TableRow></TableHeader>
                <TableBody>
                  {historicoAlertas.map((a: any) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium capitalize">{a.tipo}</TableCell>
                      <TableCell className="max-w-xs truncate">{a.mensagem}</TableCell>
                      <TableCell><Badge className={`text-xs ${nivelColors[a.nivel] || 'bg-muted text-muted-foreground'} border-0`}>{a.nivel}</Badge></TableCell>
                      <TableCell>{a.valor}</TableCell>
                      <TableCell>{a.limite}</TableCell>
                      <TableCell>{new Date(a.created_at).toLocaleString('pt-BR')}</TableCell>
                    </TableRow>
                  ))}
                  {historicoAlertas.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum alerta no histórico</TableCell></TableRow>}
                </TableBody>
              </Table>
            )}
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}