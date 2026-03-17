import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  UserCircle, Calendar, Clock, FileText, DollarSign, Heart,
  Download, Eye, Bot, ChevronRight, Briefcase, Bell,
  CheckCircle2, AlertCircle, Loader2, Edit, Upload,
  Shield, Gift, TrendingUp, Star, Megaphone, PenTool
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { toast } from 'sonner';

const quickActions = [
  { label: 'Registrar Ponto', icon: Clock, path: '/ponto', gradient: 'from-primary to-primary-glow', desc: 'Entrada/saída do dia' },
  { label: 'Solicitar Férias', icon: Calendar, path: '/ferias', gradient: 'from-warning to-warning/70', desc: 'Programar período' },
  { label: 'Meus Documentos', icon: FileText, path: '/documentos', gradient: 'from-success to-success/70', desc: 'Enviar e consultar' },
  { label: 'Holerites', icon: DollarSign, path: '/holerites', gradient: 'from-primary/80 to-primary', desc: 'Consultar contracheques' },
  { label: 'Benefícios', icon: Gift, path: '/beneficios', gradient: 'from-info to-info/70', desc: 'Meus benefícios ativos' },
  { label: 'Assistente IA', icon: Bot, path: '/assistente-ia', gradient: 'from-primary-glow to-primary', desc: 'Tire suas dúvidas' },
  { label: 'Assinar Docs', icon: PenTool, path: '/assinaturas', gradient: 'from-warning to-primary', desc: 'Documentos pendentes' },
  { label: 'Comunicados', icon: Megaphone, path: '/comunicacao', gradient: 'from-info to-success', desc: 'Avisos e mural' },
];

function usePortalCompleto(userId: string | undefined) {
  return useQuery({
    queryKey: ['portal-completo', userId],
    enabled: !!userId,
    staleTime: 3 * 60 * 1000,
    queryFn: async () => {
      const hoje = format(new Date(), 'yyyy-MM-dd');

      // Fire ALL queries in parallel
      const [
        { data: profile },
        { data: notificacoes },
        { data: pontoHoje },
        { data: feriasPendentes },
        { data: holerites },
        { data: beneficios },
        { data: comunicados },
        { data: treinamentos },
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', userId!).maybeSingle(),
        supabase.from('notificacoes').select('id, titulo, mensagem, lida, created_at, tipo').eq('user_id', userId!).eq('lida', false).order('created_at', { ascending: false }).limit(8),
        supabase.from('registros_ponto').select('entrada_1, saida_1, entrada_2, saida_2, horas_trabalhadas, horas_extras, atraso_minutos').eq('data', hoje).limit(1).maybeSingle(),
        supabase.from('ferias').select('data_inicio, data_fim, status, dias_total').in('status', ['pendente', 'aprovada']).order('data_inicio', { ascending: true }).limit(5),
        supabase.from('folhas_pagamento' as any).select('competencia, total_liquido, total_proventos').order('competencia', { ascending: false }).limit(3),
        supabase.from('beneficios').select('nome, tipo, valor, status').eq('status', 'ativo').limit(6),
        supabase.from('comunicados' as any).select('id, titulo, tipo, created_at').eq('ativo', true).order('created_at', { ascending: false }).limit(5),
        supabase.from('treinamentos' as any).select('id, nome, status, data_inicio').in('status', ['pendente', 'em_andamento']).limit(3),
      ]);

      return {
        profile, notificacoes: notificacoes || [], pontoHoje,
        feriasPendentes: feriasPendentes || [], holerites: holerites || [],
        beneficios: beneficios || [], comunicados: comunicados || [],
        treinamentos: treinamentos || [],
      };
    },
  });
}

export default function PortalPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = usePortalCompleto(user?.id);
  const [tab, setTab] = useState('visao-geral');
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ telefone: '', endereco: '' });
  const queryClient = useQueryClient();

  const nome = data?.profile?.nome || user?.name || user?.email?.split('@')[0] || 'Colaborador';
  const hoje = new Date();
  const saudacao = hoje.getHours() < 12 ? 'Bom dia' : hoje.getHours() < 18 ? 'Boa tarde' : 'Boa noite';

  const salvarDados = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('profiles').update({
        telefone: editForm.telefone || undefined,
      }).eq('user_id', user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-completo'] });
      setEditOpen(false);
      toast.success('Dados atualizados com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar dados'),
  });

  // Completude do perfil
  const completude = (() => {
    if (!data?.profile) return 0;
    const campos = ['nome', 'telefone', 'cargo', 'departamento'];
    const preenchidos = campos.filter(c => (data.profile as any)?.[c]).length;
    return Math.round((preenchidos / campos.length) * 100);
  })();

  return (
    <PageLayout title="Meu Portal" description={`${saudacao}, ${nome}!`}
      icon={<UserCircle className="h-5 w-5 text-primary-foreground" />} gradient="from-success to-primary"
    >
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="visao-geral"><UserCircle className="mr-1 h-4 w-4" />Visão Geral</TabsTrigger>
          <TabsTrigger value="financeiro"><DollarSign className="mr-1 h-4 w-4" />Financeiro</TabsTrigger>
          <TabsTrigger value="documentos"><FileText className="mr-1 h-4 w-4" />Documentos</TabsTrigger>
          <TabsTrigger value="meus-dados"><Edit className="mr-1 h-4 w-4" />Meus Dados</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral">
          <div className="space-y-6">
            {/* Perfil + Completude */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border border-border/30 rounded-2xl overflow-hidden">
                <div className="h-[3px] bg-gradient-to-r from-primary to-primary-glow" />
                <CardContent className="p-6 flex flex-col sm:flex-row gap-6 items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center ring-4 ring-primary/20">
                    <span className="text-2xl font-bold text-primary">{nome.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl font-display font-bold">{nome}</h2>
                    <p className="text-sm text-muted-foreground font-body">{data?.profile?.cargo || 'Colaborador'} • {data?.profile?.departamento || 'Geral'}</p>
                    <div className="mt-3 max-w-xs">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Perfil completo</span><span>{completude}%</span>
                      </div>
                      <Progress value={completude} className="h-2" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl" onClick={() => navigate('/perfil')}>
                      <Edit className="h-4 w-4 mr-1" />Editar Perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Status Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              {/* Ponto */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden h-full">
                  <div className="h-[2px] bg-gradient-to-r from-primary to-primary-glow" />
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary-glow"><Clock className="h-4 w-4 text-primary-foreground" /></div>
                      <h3 className="font-display font-semibold text-body">Ponto Hoje</h3>
                    </div>
                    {data?.pontoHoje ? (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-caption font-body"><span className="text-muted-foreground">Entrada</span><span className="font-semibold">{data.pontoHoje.entrada_1 || '—'}</span></div>
                        <div className="flex justify-between text-caption font-body"><span className="text-muted-foreground">Saída</span><span className="font-semibold">{data.pontoHoje.saida_1 || '—'}</span></div>
                        {data.pontoHoje.horas_trabalhadas && (
                          <div className="flex justify-between text-caption font-body pt-1 border-t border-border/30">
                            <span className="text-muted-foreground">Trabalhado</span>
                            <Badge variant="secondary" className="text-[10px]">{String(data.pontoHoje.horas_trabalhadas).slice(0, 5)}</Badge>
                          </div>
                        )}
                        {data.pontoHoje.atraso_minutos > 0 && (
                          <div className="flex justify-between text-caption font-body">
                            <span className="text-destructive">Atraso</span>
                            <Badge variant="destructive" className="text-[10px]">{data.pontoHoje.atraso_minutos} min</Badge>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-caption text-muted-foreground font-body">Nenhum registro hoje</p>
                    )}
                    <Button variant="outline" size="sm" onClick={() => navigate('/ponto')} className="w-full mt-3 rounded-lg font-body text-xs gap-1">
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
                      <div className="p-2 rounded-xl bg-gradient-to-br from-warning to-warning/70"><Bell className="h-4 w-4 text-primary-foreground" /></div>
                      <h3 className="font-display font-semibold text-body">Notificações</h3>
                      {(data?.notificacoes?.length || 0) > 0 && <Badge className="ml-auto bg-warning text-warning-foreground text-[10px]">{data?.notificacoes?.length}</Badge>}
                    </div>
                    {data?.notificacoes && data.notificacoes.length > 0 ? (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {data.notificacoes.slice(0, 4).map((n: any) => (
                          <div key={n.id} className="flex items-start gap-2 text-caption">
                            <AlertCircle className="h-3 w-3 text-warning shrink-0 mt-0.5" />
                            <span className="font-body truncate">{n.titulo}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-caption text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-success" /><span className="font-body">Tudo em dia!</span>
                      </div>
                    )}
                    <Button variant="outline" size="sm" onClick={() => navigate('/notificacoes')} className="w-full mt-3 rounded-lg font-body text-xs gap-1">Ver todas <ChevronRight className="h-3 w-3" /></Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Férias */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden h-full">
                  <div className="h-[2px] bg-gradient-to-r from-success to-success/70" />
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-success to-success/70"><Calendar className="h-4 w-4 text-primary-foreground" /></div>
                      <h3 className="font-display font-semibold text-body">Férias</h3>
                    </div>
                    {data?.feriasPendentes && data.feriasPendentes.length > 0 ? (
                      <div className="space-y-2">
                        {data.feriasPendentes.slice(0, 2).map((f: any, i: number) => (
                          <div key={i} className="flex items-center justify-between text-caption font-body">
                            <span className="text-muted-foreground">{format(parseISO(f.data_inicio), 'dd/MM')} - {format(parseISO(f.data_fim), 'dd/MM')}</span>
                            <Badge variant={f.status === 'aprovada' ? 'default' : 'outline'} className="text-[10px]">{f.status === 'aprovada' ? 'Aprovada' : 'Pendente'}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-caption text-muted-foreground font-body">Nenhuma solicitação</p>
                    )}
                    <Button variant="outline" size="sm" onClick={() => navigate('/ferias')} className="w-full mt-3 rounded-lg font-body text-xs gap-1">Solicitar Férias <ChevronRight className="h-3 w-3" /></Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Comunicados Recentes */}
            {data?.comunicados && data.comunicados.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="border border-border/30 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Megaphone className="h-4 w-4 text-primary" />
                      <CardTitle className="text-sm font-display">Comunicados Recentes</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {data.comunicados.map((c: any) => (
                      <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/30 transition-colors cursor-pointer" onClick={() => navigate('/comunicacao')}>
                        <Badge variant="outline" className="text-[10px]">{c.tipo}</Badge>
                        <span className="text-sm font-body flex-1 truncate">{c.titulo}</span>
                        <span className="text-[10px] text-muted-foreground">{new Date(c.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Quick Actions */}
            <div>
              <h2 className="text-h3 font-display font-bold mb-4">Acesso Rápido</h2>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {quickActions.map(({ label, icon: Icon, path, gradient, desc }, i) => (
                  <motion.div key={path} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.04 }}>
                    <Card className="group border border-border/30 hover:border-border/60 shadow-elevated hover:shadow-glow transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden" onClick={() => navigate(path)}>
                      <div className={cn("h-[2px] bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity", gradient)} />
                      <CardContent className="flex items-center gap-3 p-4">
                        <div className={cn("p-2.5 rounded-xl bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform", gradient)}>
                          <Icon className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-semibold text-sm">{label}</p>
                          <p className="text-xs text-muted-foreground font-body truncate">{desc}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="financeiro">
          <div className="space-y-4">
            <h2 className="text-h3 font-display font-bold">Meus Holerites</h2>
            {data?.holerites && data.holerites.length > 0 ? (
              <div className="grid gap-3">
                {data.holerites.map((h: any, i: number) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="border border-border/30 rounded-xl">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-success to-success/70"><DollarSign className="h-4 w-4 text-primary-foreground" /></div>
                          <div>
                            <p className="font-display font-semibold text-sm">{h.competencia}</p>
                            <p className="text-xs text-muted-foreground font-body">Bruto: {(h.total_proventos || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display font-bold text-success">{(h.total_liquido || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                          <p className="text-[10px] text-muted-foreground">Líquido</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="border border-border/30 rounded-xl"><CardContent className="py-8 text-center text-muted-foreground"><DollarSign className="mx-auto h-8 w-8 mb-2 opacity-40" />Nenhum holerite encontrado</CardContent></Card>
            )}

            <h2 className="text-h3 font-display font-bold mt-6">Meus Benefícios</h2>
            {data?.beneficios && data.beneficios.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {data.beneficios.map((b: any, i: number) => (
                  <Card key={i} className="border border-border/30 rounded-xl">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-info to-info/70"><Gift className="h-4 w-4 text-primary-foreground" /></div>
                        <div>
                          <p className="font-display font-semibold text-sm">{b.nome}</p>
                          <Badge variant="outline" className="text-[10px]">{b.tipo || 'Geral'}</Badge>
                        </div>
                      </div>
                      <p className="font-display font-bold text-sm">{(b.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border border-border/30 rounded-xl"><CardContent className="py-8 text-center text-muted-foreground"><Gift className="mx-auto h-8 w-8 mb-2 opacity-40" />Nenhum benefício ativo</CardContent></Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="documentos">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-h3 font-display font-bold">Meus Documentos</h2>
              <Button variant="outline" size="sm" className="rounded-xl" onClick={() => navigate('/documentos')}>
                <Upload className="h-4 w-4 mr-1" />Enviar Documento
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { label: 'Documentos Pessoais', path: '/documentos', icon: FileText, desc: 'Envie e consulte seus documentos' },
                { label: 'Contratos', path: '/assinaturas', icon: PenTool, desc: 'Assine documentos pendentes' },
                { label: 'Holerites', path: '/holerites', icon: DollarSign, desc: 'Baixe seus contracheques' },
                { label: 'Gerador de Docs', path: '/gerador-documentos', icon: FileText, desc: 'Gere declarações e atestados' },
              ].map(({ label, path, icon: Icon, desc }) => (
                <Card key={path} className="border border-border/30 rounded-xl cursor-pointer hover:shadow-elevated transition-all" onClick={() => navigate(path)}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-warning to-warning/70"><Icon className="h-4 w-4 text-primary-foreground" /></div>
                    <div className="flex-1">
                      <p className="font-display font-semibold text-sm">{label}</p>
                      <p className="text-xs text-muted-foreground font-body">{desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="meus-dados">
          <div className="max-w-2xl space-y-4">
            <Card className="border border-border/30 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-display flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-primary" />Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Nome', value: nome },
                  { label: 'Email', value: user?.email || '—' },
                  { label: 'Cargo', value: data?.profile?.cargo || '—' },
                  { label: 'Departamento', value: data?.profile?.departamento || '—' },
                  { label: 'Telefone', value: data?.profile?.telefone || '—' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-border/20 last:border-0">
                    <span className="text-sm text-muted-foreground font-body">{item.label}</span>
                    <span className="text-sm font-body font-medium">{item.value}</span>
                  </div>
                ))}
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full rounded-xl mt-2"><Edit className="h-4 w-4 mr-2" />Solicitar Alteração de Dados</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Atualizar Dados Pessoais</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div><Label>Telefone</Label><Input value={editForm.telefone} onChange={e => setEditForm(p => ({ ...p, telefone: e.target.value }))} placeholder="(11) 99999-9999" /></div>
                      <div><Label>Endereço Atualizado</Label><Textarea value={editForm.endereco} onChange={e => setEditForm(p => ({ ...p, endereco: e.target.value }))} placeholder="Rua, número, bairro, cidade" /></div>
                      <Button className="w-full" onClick={() => salvarDados.mutate()} disabled={salvarDados.isPending}>{salvarDados.isPending ? 'Salvando...' : 'Salvar Alterações'}</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card className="border border-border/30 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-display flex items-center gap-2"><Shield className="h-4 w-4 text-info" />Segurança & Privacidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start rounded-xl" onClick={() => navigate('/perfil')}>
                  <Shield className="h-4 w-4 mr-2" />Alterar Senha
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl" onClick={() => navigate('/lgpd')}>
                  <Eye className="h-4 w-4 mr-2" />Meus Dados LGPD
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
