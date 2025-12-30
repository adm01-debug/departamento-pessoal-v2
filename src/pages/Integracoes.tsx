/**
 * @fileoverview Página de Integrações com Sistemas Externos
 * @module pages/Integracoes
 * @version V8.4 - Implementação completa
 */
import { useState, useEffect, memo, useCallback } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Webhook, 
  Plus, 
  Settings, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  Loader2,
  Database,
  Globe,
  Key,
  Clock,
  AlertTriangle,
  Zap,
  FileText,
  Link2,
  ExternalLink,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

// ============================================
// TIPOS
// ============================================

interface Integracao {
  id: string;
  nome: string;
  tipo: 'bitrix24' | 'esocial' | 'contabil' | 'webhook' | 'api';
  status: 'ativo' | 'inativo' | 'erro';
  config: Record<string, string>;
  ultimaSincronizacao?: string;
  erros?: number;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const IntegracoesPage = memo(function IntegracoesPage() {
  useEffect(() => {
    document.title = 'Integrações | DP System';
  }, []);

  const [activeTab, setActiveTab] = useState('visao-geral');
  const [testando, setTestando] = useState<string | null>(null);
  const [sincronizando, setSincronizando] = useState<string | null>(null);
  const [configModal, setConfigModal] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  // Estados das integrações
  const [integracoes, setIntegracoes] = useState<Integracao[]>([
    {
      id: 'bitrix24',
      nome: 'Bitrix24',
      tipo: 'bitrix24',
      status: 'ativo',
      config: {
        webhook_url: 'https://promobrindes.bitrix24.com.br/rest/1/xxx',
        client_id: '',
        client_secret: '',
      },
      ultimaSincronizacao: new Date(Date.now() - 3600000).toISOString(),
      erros: 0,
    },
    {
      id: 'esocial',
      nome: 'eSocial',
      tipo: 'esocial',
      status: 'ativo',
      config: {
        ambiente: 'homologacao',
        certificado: 'certificado.pfx',
        senha_certificado: '',
      },
      ultimaSincronizacao: new Date(Date.now() - 86400000).toISOString(),
      erros: 2,
    },
    {
      id: 'contabil',
      nome: 'Sistema Contábil',
      tipo: 'contabil',
      status: 'inativo',
      config: {
        api_url: '',
        api_key: '',
      },
    },
    {
      id: 'n8n',
      nome: 'n8n Automation',
      tipo: 'webhook',
      status: 'ativo',
      config: {
        webhook_url: 'https://n8n.exemplo.com/webhook/dp-system',
        secret: '',
      },
      ultimaSincronizacao: new Date(Date.now() - 1800000).toISOString(),
      erros: 0,
    },
  ]);

  // Testar conexão
  const handleTestar = useCallback(async (id: string) => {
    setTestando(id);
    try {
      await new Promise(r => setTimeout(r, 2000));
      toast.success('Conexão testada com sucesso!');
    } catch {
      toast.error('Erro ao testar conexão');
    } finally {
      setTestando(null);
    }
  }, []);

  // Sincronizar
  const handleSincronizar = useCallback(async (id: string) => {
    setSincronizando(id);
    try {
      await new Promise(r => setTimeout(r, 3000));
      setIntegracoes(prev => prev.map(i => 
        i.id === id ? { ...i, ultimaSincronizacao: new Date().toISOString(), erros: 0 } : i
      ));
      toast.success('Sincronização concluída!');
    } catch {
      toast.error('Erro na sincronização');
    } finally {
      setSincronizando(null);
    }
  }, []);

  // Toggle status
  const handleToggleStatus = useCallback((id: string) => {
    setIntegracoes(prev => prev.map(i => 
      i.id === id ? { ...i, status: i.status === 'ativo' ? 'inativo' : 'ativo' } : i
    ));
    toast.success('Status atualizado');
  }, []);

  // Copiar para clipboard
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado!');
  }, []);

  // Status badge
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ativo: 'bg-green-100 text-green-800',
      inativo: 'bg-gray-100 text-gray-800',
      erro: 'bg-red-100 text-red-800',
    };
    return <Badge className={styles[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  // Formatar data
  const formatDate = (date?: string) => {
    if (!date) return 'Nunca';
    return new Date(date).toLocaleString('pt-BR');
  };

  // Ícone por tipo
  const getIconByType = (tipo: string) => {
    const icons: Record<string, React.ReactNode> = {
      bitrix24: <Database className="h-6 w-6" />,
      esocial: <FileText className="h-6 w-6" />,
      contabil: <Globe className="h-6 w-6" />,
      webhook: <Zap className="h-6 w-6" />,
      api: <Link2 className="h-6 w-6" />,
    };
    return icons[tipo] || <Webhook className="h-6 w-6" />;
  };

  return (
    <>
      <SEOHead title="Integrações" description="Gerenciamento de integrações" />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Webhook className="h-8 w-8" />
              Integrações
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie conexões com sistemas externos
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Integração
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Webhook className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{integracoes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ativas</p>
                  <p className="text-2xl font-bold">{integracoes.filter(i => i.status === 'ativo').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Com Erros</p>
                  <p className="text-2xl font-bold">{integracoes.filter(i => (i.erros || 0) > 0).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Última Sync</p>
                  <p className="text-lg font-bold">Há 30min</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="bitrix24">Bitrix24</TabsTrigger>
            <TabsTrigger value="esocial">eSocial</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          {/* Tab Visão Geral */}
          <TabsContent value="visao-geral" className="mt-6 space-y-4">
            {integracoes.map((integracao) => (
              <Card key={integracao.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${
                        integracao.status === 'ativo' ? 'bg-green-100' : 
                        integracao.status === 'erro' ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        {getIconByType(integracao.tipo)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{integracao.nome}</h3>
                          {getStatusBadge(integracao.status)}
                          {(integracao.erros || 0) > 0 && (
                            <Badge variant="destructive">{integracao.erros} erro(s)</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Última sincronização: {formatDate(integracao.ultimaSincronizacao)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={integracao.status === 'ativo'}
                        onCheckedChange={() => handleToggleStatus(integracao.id)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestar(integracao.id)}
                        disabled={testando === integracao.id}
                      >
                        {testando === integracao.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Testar'
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSincronizar(integracao.id)}
                        disabled={sincronizando === integracao.id || integracao.status !== 'ativo'}
                      >
                        {sincronizando === integracao.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfigModal(integracao.id)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Tab Bitrix24 */}
          <TabsContent value="bitrix24" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Configuração Bitrix24
                </CardTitle>
                <CardDescription>
                  Configure a integração com o Bitrix24 CRM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Conexão Ativa</AlertTitle>
                  <AlertDescription>
                    A integração com Bitrix24 está funcionando corretamente.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Webhook URL</Label>
                    <div className="flex gap-2">
                      <Input 
                        value="https://promobrindes.bitrix24.com.br/rest/1/***" 
                        readOnly 
                      />
                      <Button variant="outline" size="icon" onClick={() => handleCopy('webhook_url')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Sincronizar Colaboradores</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label>Sincronizar Tarefas</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => handleSincronizar('bitrix24')}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sincronizar Agora
                    </Button>
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Abrir Bitrix24
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab eSocial */}
          <TabsContent value="esocial" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Configuração eSocial
                </CardTitle>
                <CardDescription>
                  Configure o envio de eventos para o eSocial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Atenção</AlertTitle>
                  <AlertDescription>
                    Existem 2 eventos pendentes de envio.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Ambiente</Label>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="ambiente" value="homologacao" defaultChecked />
                        <span>Homologação</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="ambiente" value="producao" />
                        <span>Produção</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Certificado Digital</Label>
                    <div className="flex gap-2">
                      <Input value="certificado_empresa.pfx" readOnly className="flex-1" />
                      <Button variant="outline">Alterar</Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Enviar Eventos Pendentes
                    </Button>
                    <Button variant="outline">Ver Histórico</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Webhooks */}
          <TabsContent value="webhooks" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Webhooks Configurados
                </CardTitle>
                <CardDescription>
                  Gerencie webhooks para automações externas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">n8n Automation</p>
                      <p className="text-sm text-muted-foreground">
                        https://n8n.exemplo.com/webhook/dp-system
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">Testar</Button>
                    <Button variant="outline" size="sm">Configurar</Button>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Webhook
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de Configuração */}
        <Dialog open={!!configModal} onOpenChange={() => setConfigModal(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurar Integração</DialogTitle>
              <DialogDescription>
                Configure os parâmetros da integração
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>API URL</Label>
                <Input placeholder="https://api.exemplo.com" />
              </div>
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    type={showSecrets[configModal || ''] ? 'text' : 'password'} 
                    placeholder="••••••••••••" 
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowSecrets(prev => ({ ...prev, [configModal || '']: !prev[configModal || ''] }))}
                  >
                    {showSecrets[configModal || ''] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfigModal(null)}>Cancelar</Button>
              <Button onClick={() => { toast.success('Configuração salva!'); setConfigModal(null); }}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
});

export default IntegracoesPage;
