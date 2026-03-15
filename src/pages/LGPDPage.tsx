import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { lgpdService } from '@/services/lgpdService';
import { colaboradorService } from '@/services';
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';
import { Plus, ShieldCheck, FileSearch, Lock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const statusColors: Record<string, string> = { pendente: 'secondary', em_andamento: 'default', concluida: 'outline', recusada: 'destructive' };
const tipoConsentimento: Record<string, string> = { dados_pessoais: 'Dados Pessoais', dados_sensiveis: 'Dados Sensíveis', compartilhamento: 'Compartilhamento', marketing: 'Marketing' };
const tipoSolicitacao: Record<string, string> = { acesso: 'Acesso aos Dados', retificacao: 'Retificação', exclusao: 'Exclusão', portabilidade: 'Portabilidade', revogacao: 'Revogação de Consentimento' };

export default function LGPDPage() {
  const { empresaAtual } = useEmpresas();
  const qc = useQueryClient();
  const [openSol, setOpenSol] = useState(false);
  const [formSol, setFormSol] = useState({ colaborador_id: '', tipo: 'acesso', descricao: '' });

  const { data: consentimentos = [], isLoading: loadCons } = useQuery({ queryKey: ['lgpd_consentimentos', empresaAtual?.id], queryFn: () => lgpdService.listarConsentimentos(empresaAtual?.id), enabled: !!empresaAtual?.id });
  const { data: solicitacoes = [], isLoading: loadSol } = useQuery({ queryKey: ['lgpd_solicitacoes', empresaAtual?.id], queryFn: () => lgpdService.listarSolicitacoes(empresaAtual?.id), enabled: !!empresaAtual?.id });
  const { data: colaboradores = [] } = useQuery({ queryKey: ['colaboradores', empresaAtual?.id], queryFn: () => colaboradorService.list(empresaAtual?.id), enabled: !!empresaAtual?.id });

  const criarSol = useMutation({
    mutationFn: () => lgpdService.criarSolicitacao({ ...formSol, empresa_id: empresaAtual?.id, prazo_legal: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['lgpd_solicitacoes'] }); setOpenSol(false); toast.success('Solicitação LGPD registrada!'); },
    onError: () => toast.error('Erro ao registrar'),
  });

  const concluirSol = useMutation({
    mutationFn: (id: string) => lgpdService.atualizarSolicitacao(id, { status: 'concluida', concluida_em: new Date().toISOString() }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['lgpd_solicitacoes'] }); toast.success('Solicitação concluída!'); },
  });

  const revogar = useMutation({
    mutationFn: (id: string) => lgpdService.revogarConsentimento(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['lgpd_consentimentos'] }); toast.success('Consentimento revogado'); },
  });

  const aceitos = consentimentos.filter((c: any) => c.aceito).length;
  const pendentes = solicitacoes.filter((s: any) => s.status === 'pendente').length;

  return (
    <PageLayout title="LGPD — Proteção de Dados">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-4 flex items-center gap-3"><ShieldCheck className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold">{consentimentos.length}</p><p className="text-xs text-muted-foreground">Consentimentos</p></div></CardContent></Card>
        <Card><CardContent className="pt-4 flex items-center gap-3"><CheckCircle className="h-8 w-8 text-success" /><div><p className="text-2xl font-bold">{aceitos}</p><p className="text-xs text-muted-foreground">Aceitos</p></div></CardContent></Card>
        <Card><CardContent className="pt-4 flex items-center gap-3"><FileSearch className="h-8 w-8 text-info" /><div><p className="text-2xl font-bold">{solicitacoes.length}</p><p className="text-xs text-muted-foreground">Solicitações</p></div></CardContent></Card>
        <Card><CardContent className="pt-4 flex items-center gap-3"><AlertTriangle className="h-8 w-8 text-warning" /><div><p className="text-2xl font-bold">{pendentes}</p><p className="text-xs text-muted-foreground">Pendentes</p></div></CardContent></Card>
      </div>

      <Tabs defaultValue="consentimentos">
        <div className="flex justify-between items-center mb-4">
          <TabsList><TabsTrigger value="consentimentos"><Lock className="mr-1 h-4 w-4" />Consentimentos</TabsTrigger><TabsTrigger value="solicitacoes"><FileSearch className="mr-1 h-4 w-4" />Solicitações</TabsTrigger></TabsList>
          <Dialog open={openSol} onOpenChange={setOpenSol}>
            <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Nova Solicitação</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Solicitação LGPD</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Colaborador (Titular)</Label>
                  <Select value={formSol.colaborador_id} onValueChange={v => setFormSol(p => ({ ...p, colaborador_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>{colaboradores.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Tipo</Label>
                  <Select value={formSol.tipo} onValueChange={v => setFormSol(p => ({ ...p, tipo: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(tipoSolicitacao).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Descrição</Label><Textarea value={formSol.descricao} onChange={e => setFormSol(p => ({ ...p, descricao: e.target.value }))} /></div>
                <p className="text-xs text-muted-foreground">Prazo legal: 15 dias corridos (Art. 18 LGPD)</p>
                <Button className="w-full" onClick={() => criarSol.mutate()} disabled={!formSol.colaborador_id || criarSol.isPending}>{criarSol.isPending ? 'Registrando...' : 'Registrar Solicitação'}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="consentimentos">
          {loadCons ? <Spinner /> : (
            <Card>
              <Table>
                <TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Tipo</TableHead><TableHead>Status</TableHead><TableHead>Versão</TableHead><TableHead>Aceito em</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
                <TableBody>
                  {consentimentos.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum consentimento registrado</TableCell></TableRow> :
                    consentimentos.map((c: any) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{(c as any).colaborador?.nome_completo || '—'}</TableCell>
                        <TableCell>{tipoConsentimento[c.tipo] || c.tipo}</TableCell>
                        <TableCell>{c.aceito ? <Badge><CheckCircle className="h-3 w-3 mr-1" />Aceito</Badge> : <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Revogado</Badge>}</TableCell>
                        <TableCell>v{c.versao}</TableCell>
                        <TableCell className="text-xs">{c.aceito_em ? new Date(c.aceito_em).toLocaleDateString('pt-BR') : '—'}</TableCell>
                        <TableCell>{c.aceito && <Button size="sm" variant="ghost" className="text-destructive" onClick={() => revogar.mutate(c.id)}>Revogar</Button>}</TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="solicitacoes">
          {loadSol ? <Spinner /> : (
            <Card>
              <Table>
                <TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Tipo</TableHead><TableHead>Status</TableHead><TableHead>Prazo</TableHead><TableHead>Data</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
                <TableBody>
                  {solicitacoes.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhuma solicitação</TableCell></TableRow> :
                    solicitacoes.map((s: any) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{(s as any).colaborador?.nome_completo || '—'}</TableCell>
                        <TableCell>{tipoSolicitacao[s.tipo] || s.tipo}</TableCell>
                        <TableCell><Badge variant={statusColors[s.status] as any}>{s.status}</Badge></TableCell>
                        <TableCell className="text-xs">{s.prazo_legal || '—'}</TableCell>
                        <TableCell className="text-xs">{new Date(s.created_at).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>{s.status === 'pendente' && <Button size="sm" variant="outline" onClick={() => concluirSol.mutate(s.id)}>Concluir</Button>}</TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
