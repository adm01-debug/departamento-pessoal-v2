/**
 * @fileoverview Página de Suporte
 * @module pages/Suporte
 * @version V8.4
 */
import { useState, useEffect, memo, useCallback } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Headphones, MessageCircle, Mail, Phone, Clock, CheckCircle2, 
  AlertCircle, Loader2, Send, FileText, Plus
} from 'lucide-react';
import { toast } from 'sonner';

interface Chamado {
  id: string;
  assunto: string;
  status: 'aberto' | 'em_andamento' | 'resolvido' | 'fechado';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  categoria: string;
  criadoEm: string;
  atualizadoEm: string;
}

const CHAMADOS_MOCK: Chamado[] = [
  { id: 'SUP-001', assunto: 'Erro ao calcular folha', status: 'em_andamento', prioridade: 'alta', categoria: 'Folha', criadoEm: '2025-12-28', atualizadoEm: '2025-12-29' },
  { id: 'SUP-002', assunto: 'Dúvida sobre férias', status: 'resolvido', prioridade: 'baixa', categoria: 'Férias', criadoEm: '2025-12-25', atualizadoEm: '2025-12-26' },
];

const SuportePage = memo(function SuportePage() {
  useEffect(() => { document.title = 'Suporte | DP System'; }, []);

  const [activeTab, setActiveTab] = useState('novo');
  const [chamados, setChamados] = useState<Chamado[]>(CHAMADOS_MOCK);
  const [enviando, setEnviando] = useState(false);
  const [form, setForm] = useState({ assunto: '', categoria: '', prioridade: 'media', descricao: '' });

  const handleEnviar = useCallback(async () => {
    if (!form.assunto || !form.categoria || !form.descricao) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    setEnviando(true);
    await new Promise(r => setTimeout(r, 1500));
    const novoChamado: Chamado = {
      id: `SUP-${String(chamados.length + 1).padStart(3, '0')}`,
      assunto: form.assunto,
      status: 'aberto',
      prioridade: form.prioridade as Chamado['prioridade'],
      categoria: form.categoria,
      criadoEm: new Date().toISOString().split('T')[0],
      atualizadoEm: new Date().toISOString().split('T')[0],
    };
    setChamados(prev => [novoChamado, ...prev]);
    setForm({ assunto: '', categoria: '', prioridade: 'media', descricao: '' });
    setEnviando(false);
    toast.success(`Chamado ${novoChamado.id} criado com sucesso!`);
    setActiveTab('meus');
  }, [form, chamados]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      aberto: 'bg-blue-100 text-blue-800',
      em_andamento: 'bg-yellow-100 text-yellow-800',
      resolvido: 'bg-green-100 text-green-800',
      fechado: 'bg-gray-100 text-gray-800',
    };
    const labels: Record<string, string> = { aberto: 'Aberto', em_andamento: 'Em Andamento', resolvido: 'Resolvido', fechado: 'Fechado' };
    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  const getPrioridadeBadge = (prioridade: string) => {
    const styles: Record<string, string> = {
      baixa: 'bg-gray-100 text-gray-800',
      media: 'bg-blue-100 text-blue-800',
      alta: 'bg-orange-100 text-orange-800',
      urgente: 'bg-red-100 text-red-800',
    };
    return <Badge className={styles[prioridade]}>{prioridade.charAt(0).toUpperCase() + prioridade.slice(1)}</Badge>;
  };

  return (
    <>
      <SEOHead title="Suporte" description="Central de suporte técnico" />
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Headphones className="h-8 w-8" />
              Suporte
            </h1>
            <p className="text-muted-foreground mt-1">Central de atendimento e chamados</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg"><MessageCircle className="h-6 w-6 text-blue-600" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Abertos</p>
                  <p className="text-2xl font-bold">{chamados.filter(c => c.status === 'aberto').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg"><Clock className="h-6 w-6 text-yellow-600" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Em Andamento</p>
                  <p className="text-2xl font-bold">{chamados.filter(c => c.status === 'em_andamento').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg"><CheckCircle2 className="h-6 w-6 text-green-600" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Resolvidos</p>
                  <p className="text-2xl font-bold">{chamados.filter(c => c.status === 'resolvido').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg"><Headphones className="h-6 w-6 text-purple-600" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{chamados.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="novo"><Plus className="h-4 w-4 mr-2" />Novo Chamado</TabsTrigger>
            <TabsTrigger value="meus"><FileText className="h-4 w-4 mr-2" />Meus Chamados</TabsTrigger>
            <TabsTrigger value="contato"><Phone className="h-4 w-4 mr-2" />Contato</TabsTrigger>
          </TabsList>

          <TabsContent value="novo" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Abrir Novo Chamado</CardTitle>
                <CardDescription>Descreva seu problema ou dúvida</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Assunto *</Label>
                    <Input value={form.assunto} onChange={(e) => setForm(prev => ({ ...prev, assunto: e.target.value }))} placeholder="Resumo do problema" />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria *</Label>
                    <Select value={form.categoria} onValueChange={(v) => setForm(prev => ({ ...prev, categoria: v }))}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Folha">Folha de Pagamento</SelectItem>
                        <SelectItem value="Ponto">Ponto</SelectItem>
                        <SelectItem value="Férias">Férias</SelectItem>
                        <SelectItem value="Colaboradores">Colaboradores</SelectItem>
                        <SelectItem value="Sistema">Sistema/Bug</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Select value={form.prioridade} onValueChange={(v) => setForm(prev => ({ ...prev, prioridade: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Descrição *</Label>
                  <Textarea value={form.descricao} onChange={(e) => setForm(prev => ({ ...prev, descricao: e.target.value }))} placeholder="Descreva detalhadamente..." rows={5} />
                </div>
                <Button onClick={handleEnviar} disabled={enviando} className="w-full">
                  {enviando ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                  Enviar Chamado
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meus" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Meus Chamados</CardTitle>
                <CardDescription>Histórico de solicitações</CardDescription>
              </CardHeader>
              <CardContent>
                {chamados.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum chamado encontrado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chamados.map((chamado) => (
                      <div key={chamado.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-muted-foreground">{chamado.id}</span>
                            {getStatusBadge(chamado.status)}
                            {getPrioridadeBadge(chamado.prioridade)}
                          </div>
                          <p className="font-medium mt-1">{chamado.assunto}</p>
                          <p className="text-sm text-muted-foreground">Criado: {chamado.criadoEm} • Atualizado: {chamado.atualizadoEm}</p>
                        </div>
                        <Button variant="outline" size="sm">Ver Detalhes</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contato" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Mail className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold">E-mail</h3>
                  <p className="text-muted-foreground">suporte@dpsystem.com.br</p>
                  <p className="text-sm text-muted-foreground mt-2">Resposta em até 24h</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Phone className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold">Telefone</h3>
                  <p className="text-muted-foreground">(11) 3000-0000</p>
                  <p className="text-sm text-muted-foreground mt-2">Seg-Sex 8h às 18h</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <MessageCircle className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold">Chat Online</h3>
                  <p className="text-muted-foreground">Atendimento imediato</p>
                  <Button className="mt-2">Iniciar Chat</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
});

export default SuportePage;
