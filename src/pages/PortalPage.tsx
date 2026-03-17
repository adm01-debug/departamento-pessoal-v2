import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  UserCircle, Calendar, Clock, FileText, DollarSign, Heart,
  Download, Eye, Bot, ChevronRight, Briefcase, Bell,
  CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const quickActions = [
  { label: 'Registrar Ponto', icon: Clock, path: '/ponto', gradient: 'from-primary to-primary-glow', desc: 'Entrada/saída do dia' },
  { label: 'Solicitar Férias', icon: Calendar, path: '/ferias', gradient: 'from-warning to-warning/70', desc: 'Programar período' },
  { label: 'Meus Documentos', icon: FileText, path: '/documentos', gradient: 'from-success to-success/70', desc: 'Enviar e consultar' },
  { label: 'Holerites', icon: DollarSign, path: '/holerites', gradient: 'from-primary/80 to-primary', desc: 'Consultar contracheques' },
  { label: 'Afastamentos', icon: Heart, path: '/afastamentos', gradient: 'from-destructive to-destructive/70', desc: 'Atestados e licenças' },
  { label: 'Assistente IA', icon: Bot, path: '/assistente-ia', gradient: 'from-primary-glow to-primary', desc: 'Tire suas dúvidas' },
];

function useColaboradorInfo(userId: string | undefined) {
  return useQuery({
    queryKey: ['portal-info', userId],
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId!)
        .maybeSingle();

      // Get recent notifications
      const { data: notificacoes } = await supabase
        .from('notificacoes')
        .select('id, titulo, mensagem, lida, created_at, tipo')
        .eq('user_id', userId!)
        .eq('lida', false)
        .order('created_at', { ascending: false })
        .limit(5);

      // Get today's ponto
      const hoje = format(new Date(), 'yyyy-MM-dd');
      const { data: pontoHoje } = await supabase
        .from('registros_ponto')
        .select('entrada_1, saida_1, entrada_2, saida_2, horas_trabalhadas')
        .eq('data', hoje)
        .limit(1)
        .maybeSingle();

      // Get pending ferias
      const { data: feriasPendentes } = await supabase
        .from('ferias')
        .select('data_inicio, data_fim, status, dias_total')
        .in('status', ['pendente', 'aprovada'])
        .order('data_inicio', { ascending: true })
        .limit(3);

      return {
        profile,
        notificacoes: notificacoes || [],
        pontoHoje,
        feriasPendentes: feriasPendentes || [],
      };
    },
  });
}

export default function PortalPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = useColaboradorInfo(user?.id);

  const nome = data?.profile?.nome || user?.name || user?.email?.split('@')[0] || 'Colaborador';
  const hoje = new Date();
  const saudacao = hoje.getHours() < 12 ? 'Bom dia' : hoje.getHours() < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <PageLayout
      title="Meu Portal"
      description={`${saudacao}, ${nome}!`}
      icon={<UserCircle className="h-5 w-5 text-primary-foreground" />}
      gradient="from-success to-primary"
    >
      <div className="space-y-6">
        {/* Status Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          {/* Ponto de hoje */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden h-full">
              <div className="h-[2px] bg-gradient-to-r from-primary to-primary-glow" />
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary-glow">
                    <Clock className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-body">Ponto Hoje</h3>
                </div>
                {data?.pontoHoje ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-caption font-body">
                      <span className="text-muted-foreground">Entrada</span>
                      <span className="font-semibold">{data.pontoHoje.entrada_1 || '—'}</span>
                    </div>
                    <div className="flex justify-between text-caption font-body">
                      <span className="text-muted-foreground">Saída</span>
                      <span className="font-semibold">{data.pontoHoje.saida_1 || '—'}</span>
                    </div>
                    {data.pontoHoje.horas_trabalhadas && (
                      <div className="flex justify-between text-caption font-body pt-1 border-t border-border/30">
                        <span className="text-muted-foreground">Trabalhado</span>
                        <Badge variant="secondary" className="text-[10px]">{String(data.pontoHoje.horas_trabalhadas).slice(0, 5)}</Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-caption text-muted-foreground font-body">Nenhum registro hoje</p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/ponto')}
                  className="w-full mt-3 rounded-lg font-body text-xs gap-1"
                >
                  Registrar Ponto <ChevronRight className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notificações */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden h-full">
              <div className="h-[2px] bg-gradient-to-r from-warning to-warning/70" />
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-warning to-warning/70">
                    <Bell className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-body">Notificações</h3>
                  {(data?.notificacoes?.length || 0) > 0 && (
                    <Badge className="ml-auto bg-warning text-warning-foreground text-[10px]">{data?.notificacoes?.length}</Badge>
                  )}
                </div>
                {data?.notificacoes && data.notificacoes.length > 0 ? (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {data.notificacoes.slice(0, 3).map((n: any) => (
                      <div key={n.id} className="flex items-start gap-2 text-caption">
                        <AlertCircle className="h-3 w-3 text-warning shrink-0 mt-0.5" />
                        <span className="font-body truncate">{n.titulo}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-caption text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="font-body">Tudo em dia!</span>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/notificacoes')}
                  className="w-full mt-3 rounded-lg font-body text-xs gap-1"
                >
                  Ver todas <ChevronRight className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Férias */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden h-full">
              <div className="h-[2px] bg-gradient-to-r from-success to-success/70" />
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-success to-success/70">
                    <Calendar className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-body">Férias</h3>
                </div>
                {data?.feriasPendentes && data.feriasPendentes.length > 0 ? (
                  <div className="space-y-2">
                    {data.feriasPendentes.slice(0, 2).map((f: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-caption font-body">
                        <span className="text-muted-foreground">
                          {format(parseISO(f.data_inicio), 'dd/MM')} - {format(parseISO(f.data_fim), 'dd/MM')}
                        </span>
                        <Badge variant={f.status === 'aprovada' ? 'default' : 'outline'} className="text-[10px]">
                          {f.status === 'aprovada' ? 'Aprovada' : 'Pendente'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-caption text-muted-foreground font-body">Nenhuma solicitação</p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/ferias')}
                  className="w-full mt-3 rounded-lg font-body text-xs gap-1"
                >
                  Solicitar Férias <ChevronRight className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-h3 font-display font-bold mb-4">Acesso Rápido</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map(({ label, icon: Icon, path, gradient, desc }, i) => (
              <motion.div
                key={path}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
              >
                <Card
                  className="group border border-border/30 hover:border-border/60 shadow-elevated hover:shadow-glow transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden"
                  onClick={() => navigate(path)}
                >
                  <div className={cn("h-[2px] bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity", gradient)} />
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className={cn("p-3 rounded-xl bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform", gradient)}>
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-display font-semibold">{label}</p>
                      <p className="text-sm text-muted-foreground font-body">{desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
