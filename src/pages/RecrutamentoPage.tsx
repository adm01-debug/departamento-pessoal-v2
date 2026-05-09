import { PageTitle } from '@/components/PageTitle';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recrutamentoService } from '@/services/recrutamentoService';
import { useEmpresas } from '@/hooks';
import { UserSearch, Plus, Briefcase, Users, Filter, BarChart3, ChevronRight, Mail, Phone, Calendar, Star, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const ETAPAS = [
  { id: 'triagem', label: 'Triagem', color: 'bg-slate-100 border-slate-200' },
  { id: 'entrevista', label: 'Entrevista', color: 'bg-blue-50 border-blue-200' },
  { id: 'teste', label: 'Teste Técnico', color: 'bg-purple-50 border-purple-200' },
  { id: 'proposta', label: 'Proposta', color: 'bg-warning-foreground/10 border-warning' },
  { id: 'contratado', label: 'Contratado', color: 'bg-success-foreground/10 border-success' },
];

export default function RecrutamentoPage() {
  const { empresaAtual } = useEmpresas();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('pipeline');
  const [selectedVagaId, setSelectedVagaId] = useState<string>('all');

  const { data: vagas = [], isLoading: loadVagas } = useQuery({
    queryKey: ['vagas', empresaAtual?.id],
    queryFn: () => recrutamentoService.listarVagas(empresaAtual?.id),
    enabled: !!empresaAtual?.id
  });

  const { data: candidaturas = [], isLoading: loadCandidaturas } = useQuery({
    queryKey: ['candidaturas', selectedVagaId],
    queryFn: () => recrutamentoService.listarCandidaturas(selectedVagaId === 'all' ? undefined : selectedVagaId),
    enabled: !!empresaAtual?.id
  });

  const { data: candidatos = [], isLoading: loadCandidatos } = useQuery({
    queryKey: ['candidatos', empresaAtual?.id],
    queryFn: () => recrutamentoService.listarCandidatos(empresaAtual?.id),
    enabled: !!empresaAtual?.id
  });

  const updateEtapa = useMutation({
    mutationFn: ({ id, etapa }: { id: string, etapa: string }) => recrutamentoService.atualizarCandidatura(id, { etapa }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['candidaturas'] });
      toast.success('Etapa atualizada!');
    }
  });

  const isLoading = loadVagas || loadCandidaturas || loadCandidatos;

  return (
    <>
      <PageTitle title="Recrutamento" description="Gestão de talentos e processos seletivos" />
      <PageLayout
        title="Recrutamento & Seleção"
        description="Gestão de vagas, candidatos e pipeline 10/10"
        icon={<UserSearch className="h-5 w-5 text-primary-foreground" />}
        gradient="from-success to-info"
        actions={
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="rounded-xl shadow-lg"><Plus className="h-4 w-4 mr-2" />Nova Vaga</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Anunciar Nova Vaga</DialogTitle></DialogHeader>
                <div className="grid gap-3 pt-4">
                  <div className="grid gap-1"><Label>Título da Vaga</Label><Input placeholder="Ex: Desenvolvedor Senior" /></div>
                  <div className="grid gap-1"><Label>Departamento</Label><Input placeholder="Ex: Tecnologia" /></div>
                  <div className="grid gap-1"><Label>Quantidade</Label><Input type="number" defaultValue={1} /></div>
                  <Button className="mt-2">Publicar Vaga</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        }
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <TabsList className="bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="pipeline" className="rounded-lg">Pipeline</TabsTrigger>
              <TabsTrigger value="vagas" className="rounded-lg">Vagas</TabsTrigger>
              <TabsTrigger value="candidatos" className="rounded-lg">Candidatos</TabsTrigger>
              <TabsTrigger value="analytics" className="rounded-lg">Analytics</TabsTrigger>
            </TabsList>

            {activeTab === 'pipeline' && (
              <div className="flex items-center gap-2 w-full md:w-64">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedVagaId} onValueChange={setSelectedVagaId}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Filtrar por Vaga" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Vagas</SelectItem>
                    {vagas.map((v: any) => <SelectItem key={v.id} value={v.id}>{v.titulo}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            ) : (
              <>
                {/* PIPELINE KANBAN */}
                <TabsContent value="pipeline" className="mt-0">
                  <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar min-h-[500px]">
                    {ETAPAS.map((etapa) => (
                      <div key={etapa.id} className="flex-shrink-0 w-72 flex flex-col gap-3">
                        <div className="flex items-center justify-between px-2">
                          <h3 className="font-display font-semibold text-sm flex items-center gap-2">
                            {etapa.label}
                            <Badge variant="secondary" className="rounded-full h-5 px-1.5 text-[10px]">
                              {candidaturas.filter((c: any) => (c.etapa || 'triagem') === etapa.id).length}
                            </Badge>
                          </h3>
                        </div>
                        
                        <div className={cn("flex-1 rounded-2xl border-2 border-dashed p-3 space-y-3 transition-colors", etapa.color)}>
                          {candidaturas
                            .filter((c: any) => (c.etapa || 'triagem') === etapa.id)
                            .map((cand: any, idx: number) => (
                              <motion.div 
                                key={cand.id}
                                layoutId={cand.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white p-3 rounded-xl shadow-sm border border-border/40 hover:shadow-md transition-all cursor-pointer group"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-semibold text-xs truncate max-w-[150px]">{cand.candidato?.nome}</h4>
                                  <Badge variant="outline" className="text-[9px] h-4 px-1">{cand.vaga?.titulo}</Badge>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-3">
                                  <span className="flex items-center gap-1"><Star className="h-3 w-3 text-warning fill-warning" /> {cand.nota_geral || 0}</span>
                                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> 2d</span>
                                </div>
                                <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md"><Mail className="h-3 w-3" /></Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md"><Phone className="h-3 w-3" /></Button>
                                  </div>
                                  <Select 
                                    onValueChange={(val) => updateEtapa.mutate({ id: cand.id, etapa: val })}
                                    defaultValue={etapa.id}
                                  >
                                    <SelectTrigger className="h-6 text-[9px] w-24 rounded-md">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {ETAPAS.map(e => <SelectItem key={e.id} value={e.id}>{e.label}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </motion.div>
                            ))}
                          {candidaturas.filter((c: any) => (c.etapa || 'triagem') === etapa.id).length === 0 && (
                            <div className="h-32 flex items-center justify-center border border-dashed rounded-xl opacity-20">
                              <span className="text-xs">Vazio</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* VAGAS */}
                <TabsContent value="vagas" className="mt-0">
                  <div className="grid gap-4 md:grid-cols-3">
                    {vagas.map((vaga: any) => (
                      <Card key={vaga.id} className="rounded-2xl border-border/40 hover:border-primary/30 transition-all group overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <Badge variant={vaga.status === 'aberta' ? 'default' : 'secondary'} className="rounded-lg">{vaga.status}</Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                          <CardTitle className="text-lg mt-2 font-display">{vaga.titulo}</CardTitle>
                          <CardDescription className="text-xs">{vaga.departamento} • {vaga.modalidade}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1"><Users className="h-4 w-4" /> {candidaturas.filter((c: any) => c.vaga_id === vaga.id).length} Candidatos</div>
                            <Button variant="ghost" size="sm" className="h-8 rounded-lg group-hover:translate-x-1 transition-transform">
                              Ver Detalhes <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* CANDIDATOS */}
                <TabsContent value="candidatos" className="mt-0">
                   <Card className="rounded-2xl border-border/40 overflow-hidden">
                     <CardContent className="p-0">
                       <div className="overflow-x-auto">
                         <table className="w-full text-sm">
                           <thead className="bg-muted/30 border-b">
                             <tr>
                               <th className="px-4 py-3 text-left font-medium">Nome</th>
                               <th className="px-4 py-3 text-left font-medium">E-mail</th>
                               <th className="px-4 py-3 text-left font-medium">Experiência</th>
                               <th className="px-4 py-3 text-left font-medium">Pretensão</th>
                               <th className="px-4 py-3 text-right font-medium">Ações</th>
                             </tr>
                           </thead>
                           <tbody>
                             {candidatos.map((cand: any) => (
                               <tr key={cand.id} className="border-b hover:bg-muted/10 transition-colors group">
                                 <td className="px-4 py-3 font-medium">{cand.nome}</td>
                                 <td className="px-4 py-3 text-muted-foreground">{cand.email}</td>
                                 <td className="px-4 py-3">{cand.experiencia_anos} anos</td>
                                 <td className="px-4 py-3 text-success font-medium">R$ {cand.pretensao_salarial?.toLocaleString()}</td>
                                 <td className="px-4 py-3 text-right">
                                   <Button variant="ghost" size="sm" className="rounded-lg">Perfil</Button>
                                 </td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       </div>
                     </CardContent>
                   </Card>
                </TabsContent>

                {/* ANALYTICS */}
                <TabsContent value="analytics" className="mt-0">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-primary/5 to-transparent">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Time-to-Hire</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">18 dias</div>
                        <p className="text-[10px] text-success mt-1">↑ 12% melhor que mês passado</p>
                      </CardContent>
                    </Card>
                    <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-success/5 to-transparent">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Conversão de Funil</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">4.2%</div>
                        <p className="text-[10px] text-muted-foreground mt-1">Visitantes vs Contratados</p>
                      </CardContent>
                    </Card>
                    <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-info/5 to-transparent">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Candidatos Ativos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{candidatos.length}</div>
                        <p className="text-[10px] text-muted-foreground mt-1">Em todas as etapas</p>
                      </CardContent>
                    </Card>
                    <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-warning/5 to-transparent">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Custo por Contratação</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">R$ 1.250</div>
                        <p className="text-[10px] text-destructive mt-1">↓ 5% aumento de custos</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="mt-6 rounded-2xl border-border/30">
                    <CardHeader>
                      <CardTitle>Distribuição por Etapa</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 flex items-end gap-2 pb-6">
                      {ETAPAS.map((e) => {
                        const count = candidaturas.filter((c: any) => (c.etapa || 'triagem') === e.id).length;
                        const height = (count / (candidaturas.length || 1)) * 100 + 10;
                        return (
                          <div key={e.id} className="flex-1 flex flex-col items-center gap-2">
                            <div 
                              className={cn("w-full rounded-t-lg transition-all duration-500 bg-primary/20 hover:bg-primary/40")} 
                              style={{ height: `${height}%` }}
                            />
                            <span className="text-[10px] uppercase font-bold opacity-60">{e.label}</span>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
          </AnimatePresence>
        </Tabs>
      </PageLayout>
    </>
  );
}