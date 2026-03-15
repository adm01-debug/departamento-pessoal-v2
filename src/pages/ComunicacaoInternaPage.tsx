import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { comunicacaoService } from '@/services/comunicacaoService';
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';
import { Plus, Megaphone, Shield, AlertTriangle, Trash2, Pin } from 'lucide-react';

const prioridadeColors: Record<string, string> = { baixa: 'secondary', normal: 'outline', alta: 'default', urgente: 'destructive' };
const statusEticaColors: Record<string, string> = { aberto: 'default', em_analise: 'secondary', resolvido: 'outline', arquivado: 'outline' };

export default function ComunicacaoInternaPage() {
  const { empresaAtual } = useEmpresas();
  const qc = useQueryClient();
  const [openCom, setOpenCom] = useState(false);
  const [openEtica, setOpenEtica] = useState(false);
  const [formCom, setFormCom] = useState({ titulo: '', conteudo: '', tipo: 'aviso', prioridade: 1 });
  const [formEtica, setFormEtica] = useState({ categoria: 'outro', descricao: '', anonimo: true });

  const { data: comunicados = [], isLoading: loadCom } = useQuery({
    queryKey: ['comunicados', empresaAtual?.id],
    queryFn: () => comunicacaoService.listarComunicados(empresaAtual?.id),
    enabled: !!empresaAtual?.id,
  });

  const { data: denuncias = [], isLoading: loadEtica } = useQuery({
    queryKey: ['canal_etica', empresaAtual?.id],
    queryFn: () => comunicacaoService.listarDenuncias(empresaAtual?.id),
    enabled: !!empresaAtual?.id,
  });

  const criarCom = useMutation({
    mutationFn: () => comunicacaoService.criarComunicado({ ...formCom, empresa_id: empresaAtual?.id, ativo: true }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['comunicados'] }); setOpenCom(false); toast.success('Comunicado publicado!'); },
    onError: () => toast.error('Erro ao publicar'),
  });

  const criarEtica = useMutation({
    mutationFn: () => comunicacaoService.criarDenuncia({ ...formEtica, empresa_id: empresaAtual?.id }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['canal_etica'] }); setOpenEtica(false); toast.success('Relato registrado!'); },
    onError: () => toast.error('Erro ao registrar'),
  });

  const excluirCom = useMutation({
    mutationFn: (id: string) => comunicacaoService.excluirComunicado(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['comunicados'] }); toast.success('Comunicado excluído'); },
  });

  return (
    <PageLayout title="Comunicação Interna">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-4 flex items-center gap-3"><Megaphone className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold">{comunicados.length}</p><p className="text-xs text-muted-foreground">Comunicados</p></div></CardContent></Card>
        <Card><CardContent className="pt-4 flex items-center gap-3"><Pin className="h-8 w-8 text-warning" /><div><p className="text-2xl font-bold">{comunicados.filter((c: any) => c.ativo).length}</p><p className="text-xs text-muted-foreground">Ativos</p></div></CardContent></Card>
        <Card><CardContent className="pt-4 flex items-center gap-3"><Shield className="h-8 w-8 text-info" /><div><p className="text-2xl font-bold">{denuncias.length}</p><p className="text-xs text-muted-foreground">Relatos Éticos</p></div></CardContent></Card>
        <Card><CardContent className="pt-4 flex items-center gap-3"><AlertTriangle className="h-8 w-8 text-destructive" /><div><p className="text-2xl font-bold">{denuncias.filter((d: any) => d.status === 'aberto').length}</p><p className="text-xs text-muted-foreground">Abertos</p></div></CardContent></Card>
      </div>

      <Tabs defaultValue="comunicados">
        <TabsList className="mb-4"><TabsTrigger value="comunicados"><Megaphone className="mr-1 h-4 w-4" />Mural</TabsTrigger><TabsTrigger value="etica"><Shield className="mr-1 h-4 w-4" />Canal de Ética</TabsTrigger></TabsList>

        <TabsContent value="comunicados">
          <div className="flex justify-end mb-4">
            <Dialog open={openCom} onOpenChange={setOpenCom}>
              <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Novo Comunicado</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Novo Comunicado</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Título</Label><Input value={formCom.titulo} onChange={e => setFormCom(p => ({ ...p, titulo: e.target.value }))} /></div>
                  <div><Label>Tipo</Label>
                    <Select value={formCom.tipo} onValueChange={v => setFormCom(p => ({ ...p, tipo: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="aviso">Aviso</SelectItem><SelectItem value="mural">Mural</SelectItem><SelectItem value="evento">Evento</SelectItem><SelectItem value="urgente">Urgente</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div><Label>Conteúdo</Label><Textarea value={formCom.conteudo} onChange={e => setFormCom(p => ({ ...p, conteudo: e.target.value }))} rows={4} /></div>
                  <Button className="w-full" onClick={() => criarCom.mutate()} disabled={!formCom.titulo || criarCom.isPending}>{criarCom.isPending ? 'Publicando...' : 'Publicar'}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {loadCom ? <Spinner /> : comunicados.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground"><Megaphone className="mx-auto h-12 w-12 mb-4 opacity-50" /><p>Nenhum comunicado</p></CardContent></Card>
          ) : (
            <div className="space-y-4">
              {comunicados.map((c: any) => (
                <Card key={c.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{c.titulo}</CardTitle>
                      <div className="flex gap-2"><Badge variant="outline">{c.tipo}</Badge>{c.ativo && <Badge>Ativo</Badge>}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{c.conteudo}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString('pt-BR')}</span>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => excluirCom.mutate(c.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="etica">
          <div className="flex justify-end mb-4">
            <Dialog open={openEtica} onOpenChange={setOpenEtica}>
              <DialogTrigger asChild><Button variant="outline"><Plus className="mr-2 h-4 w-4" />Novo Relato</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Canal de Ética — Novo Relato</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Categoria</Label>
                    <Select value={formEtica.categoria} onValueChange={v => setFormEtica(p => ({ ...p, categoria: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="assedio">Assédio</SelectItem><SelectItem value="discriminacao">Discriminação</SelectItem><SelectItem value="fraude">Fraude</SelectItem><SelectItem value="seguranca">Segurança</SelectItem><SelectItem value="outro">Outro</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div><Label>Descrição</Label><Textarea value={formEtica.descricao} onChange={e => setFormEtica(p => ({ ...p, descricao: e.target.value }))} rows={4} placeholder="Descreva a situação..." /></div>
                  <Button className="w-full" onClick={() => criarEtica.mutate()} disabled={!formEtica.descricao || criarEtica.isPending}>{criarEtica.isPending ? 'Registrando...' : 'Enviar Relato (Anônimo)'}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {loadEtica ? <Spinner /> : (
            <Card>
              <Table>
                <TableHeader><TableRow><TableHead>Protocolo</TableHead><TableHead>Categoria</TableHead><TableHead>Status</TableHead><TableHead>Prioridade</TableHead><TableHead>Data</TableHead></TableRow></TableHeader>
                <TableBody>
                  {denuncias.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhum relato registrado</TableCell></TableRow> :
                    denuncias.map((d: any) => (
                      <TableRow key={d.id}>
                        <TableCell className="font-mono text-xs">{d.protocolo?.slice(0, 8)}</TableCell>
                        <TableCell><Badge variant="outline">{d.categoria}</Badge></TableCell>
                        <TableCell><Badge variant={statusEticaColors[d.status] as any}>{d.status}</Badge></TableCell>
                        <TableCell>{d.prioridade}</TableCell>
                        <TableCell className="text-xs">{new Date(d.created_at).toLocaleDateString('pt-BR')}</TableCell>
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
