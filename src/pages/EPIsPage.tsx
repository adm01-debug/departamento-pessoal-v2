import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { episService, episEntregasService } from '@/services';
import { colaboradorService } from '@/services';
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';
import { Plus, HardHat, Package, Trash2 } from 'lucide-react';

export default function EPIsPage() {
  const { empresaAtual } = useEmpresas();
  const qc = useQueryClient();
  const [openEpi, setOpenEpi] = useState(false);
  const [openEntrega, setOpenEntrega] = useState(false);
  const [formEpi, setFormEpi] = useState({ nome: '', ca: '', validade_meses: '', categoria: 'cabeca' });
  const [formEntrega, setFormEntrega] = useState({ epi_id: '', colaborador_id: '', data_entrega: '', quantidade: '1' });

  const { data: epis = [], isLoading } = useQuery({ queryKey: ['epis', empresaAtual?.id], queryFn: () => episService.listar(empresaAtual?.id), enabled: !!empresaAtual?.id });
  const { data: entregas = [] } = useQuery({ queryKey: ['epis-entregas', empresaAtual?.id], queryFn: () => episEntregasService.listar(empresaAtual?.id), enabled: !!empresaAtual?.id });
  const { data: colaboradores = [] } = useQuery({ queryKey: ['colaboradores', empresaAtual?.id], queryFn: () => colaboradorService.list(empresaAtual?.id), enabled: !!empresaAtual?.id });

  const criarEpi = useMutation({
    mutationFn: (d: any) => episService.criar({ ...d, empresa_id: empresaAtual?.id, validade_meses: Number(d.validade_meses) || null }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['epis'] }); setOpenEpi(false); toast.success('EPI cadastrado!'); },
    onError: (e: Error) => toast.error(e.message),
  });

  const criarEntrega = useMutation({
    mutationFn: (d: any) => episEntregasService.criar({ ...d, empresa_id: empresaAtual?.id, quantidade: Number(d.quantidade) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['epis-entregas'] }); setOpenEntrega(false); toast.success('Entrega registrada!'); },
    onError: (e: Error) => toast.error(e.message),
  });

  const excluirEpi = useMutation({
    mutationFn: (id: string) => episService.excluir(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['epis'] }); toast.success('EPI excluído!'); },
  });

  const categorias = ['cabeca', 'olhos', 'auditiva', 'respiratoria', 'maos', 'pes', 'corpo', 'queda', 'outros'];

  if (isLoading) return <PageLayout title="EPIs"><Spinner /></PageLayout>;

  return (
    <PageLayout title="Equipamentos de Proteção Individual" subtitle="Gestão de EPIs e entregas aos colaboradores">
      <Tabs defaultValue="epis">
        <TabsList>
          <TabsTrigger value="epis"><HardHat className="h-4 w-4 mr-1" />Catálogo EPIs ({epis.length})</TabsTrigger>
          <TabsTrigger value="entregas"><Package className="h-4 w-4 mr-1" />Entregas ({entregas.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="epis">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold">EPIs Cadastrados</h3>
                <Dialog open={openEpi} onOpenChange={setOpenEpi}>
                  <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Novo EPI</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Cadastrar EPI</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div><Label>Nome *</Label><Input value={formEpi.nome} onChange={e => setFormEpi(p => ({ ...p, nome: e.target.value }))} /></div>
                      <div><Label>Certificado de Aprovação (CA)</Label><Input value={formEpi.ca} onChange={e => setFormEpi(p => ({ ...p, ca: e.target.value }))} /></div>
                      <div><Label>Validade (meses)</Label><Input type="number" value={formEpi.validade_meses} onChange={e => setFormEpi(p => ({ ...p, validade_meses: e.target.value }))} /></div>
                      <div><Label>Categoria</Label>
                        <Select value={formEpi.categoria} onValueChange={v => setFormEpi(p => ({ ...p, categoria: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{categorias.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full" onClick={() => criarEpi.mutate(formEpi)} disabled={!formEpi.nome}>Salvar</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Table>
                <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>CA</TableHead><TableHead>Categoria</TableHead><TableHead>Validade</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
                <TableBody>
                  {epis.map((e: any) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.nome}</TableCell>
                      <TableCell>{e.ca || '—'}</TableCell>
                      <TableCell><Badge variant="outline">{e.categoria || '—'}</Badge></TableCell>
                      <TableCell>{e.validade_meses ? `${e.validade_meses} meses` : '—'}</TableCell>
                      <TableCell><Button size="icon" variant="ghost" onClick={() => excluirEpi.mutate(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                    </TableRow>
                  ))}
                  {epis.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Nenhum EPI cadastrado</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entregas">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold">Entregas Registradas</h3>
                <Dialog open={openEntrega} onOpenChange={setOpenEntrega}>
                  <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Nova Entrega</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Registrar Entrega</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div><Label>EPI *</Label>
                        <Select value={formEntrega.epi_id} onValueChange={v => setFormEntrega(p => ({ ...p, epi_id: v }))}>
                          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent>{epis.map((e: any) => <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div><Label>Colaborador *</Label>
                        <Select value={formEntrega.colaborador_id} onValueChange={v => setFormEntrega(p => ({ ...p, colaborador_id: v }))}>
                          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent>{colaboradores.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div><Label>Data Entrega *</Label><Input type="date" value={formEntrega.data_entrega} onChange={e => setFormEntrega(p => ({ ...p, data_entrega: e.target.value }))} /></div>
                      <div><Label>Quantidade</Label><Input type="number" value={formEntrega.quantidade} onChange={e => setFormEntrega(p => ({ ...p, quantidade: e.target.value }))} /></div>
                      <Button className="w-full" onClick={() => criarEntrega.mutate(formEntrega)} disabled={!formEntrega.epi_id || !formEntrega.colaborador_id}>Registrar</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Table>
                <TableHeader><TableRow><TableHead>EPI</TableHead><TableHead>Colaborador</TableHead><TableHead>Data</TableHead><TableHead>Qtd</TableHead></TableRow></TableHeader>
                <TableBody>
                  {entregas.map((e: any) => (
                    <TableRow key={e.id}>
                      <TableCell>{e.epi?.nome || e.epi_id}</TableCell>
                      <TableCell>{e.colaborador?.nome_completo || e.colaborador_id}</TableCell>
                      <TableCell>{e.data_entrega}</TableCell>
                      <TableCell>{e.quantidade}</TableCell>
                    </TableRow>
                  ))}
                  {entregas.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Nenhuma entrega registrada</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
