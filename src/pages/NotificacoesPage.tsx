import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { EmptyList } from '@/components/ui/empty-state';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Check, CheckCheck, Trash2, AlertCircle, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const tipoIcon: Record<string, React.ElementType> = {
  info: Info, alerta: AlertTriangle, sucesso: CheckCircle, erro: AlertCircle,
};
const tipoGradient: Record<string, string> = {
  info: 'from-info to-level', alerta: 'from-warning to-coins', sucesso: 'from-success to-finance', erro: 'from-destructive to-destructive',
};

export default function NotificacoesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

  const naoLidas = notificacoes?.filter((n: any) => !n.lida).length || 0;

  return (
    <PageLayout title="Notificações" description={`${naoLidas} não lida${naoLidas !== 1 ? 's' : ''}`} icon={<Bell className="h-5 w-5 text-white" />} gradient="from-streak to-warning"
      actions={naoLidas > 0 ? <Button variant="outline" onClick={() => marcarTodasLidas.mutate()} className="rounded-xl font-body"><CheckCheck className="h-4 w-4 mr-2" />Marcar todas como lidas</Button> : undefined}
    >
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
    </PageLayout>
  );
}
