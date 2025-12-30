import { SEOHead } from '@/components/SEOHead';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import {
  Settings, Link2, RefreshCw, Download, Upload, CheckCircle, XCircle,
  AlertCircle, Loader2, History, Users, Building2, ArrowRightLeft,
  Save, TestTube, Clock, Zap, Play, Pause
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useBitrix24Sync, ConfiguracaoSync, DirecaoSync, ResultadoSync } from '@/hooks/useBitrix24Sync';
import { useAutoSync, AutoSyncStatusBadge } from '@/hooks/useAutoSync';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const CAMPOS_DISPONIVEIS = [
  { id: 'nome_completo', label: 'Nome Completo' },
  { id: 'email', label: 'E-mail' },
  { id: 'telefone', label: 'Telefone' },
  { id: 'cargo', label: 'Cargo' },
  { id: 'departamento', label: 'Departamento' },
  { id: 'data_nascimento', label: 'Data de Nascimento' },
  { id: 'data_admissao', label: 'Data de Admissão' },
  { id: 'endereco', label: 'Endereço' },
];

export default function Bitrix24Config() {
  useEffect(() => {
    document.title = 'Configuração Bitrix24 | DP System';
  }, []);

  const {
    useConfiguracao,
    salvarConfiguracao,
    testarConexao,
    isTestando,
    importarDoBitrix,
    exportarParaBitrix,
    sincronizarBidirecional,
    syncProgress,
    useHistoricoSync,
  } = useBitrix24Sync();

  // Hook de Auto-Sync
  const { 
    config: autoSyncConfig, 
    status: autoSyncStatus, 
    toggleAutoSync, 
    executarSyncManual,
    atualizarConfig: atualizarAutoSyncConfig,
    isUpdating: isUpdatingAutoSync
  } = useAutoSync();

  const { data: configAtual, isLoading: loadingConfig } = useConfiguracao();
  const { data: historico, isLoading: loadingHistorico } = useHistoricoSync();

  // Estado do formulário
  const [config, setConfig] = useState<ConfiguracaoSync>({
    webhook_url: '',
    direcao: 'bidirecional',
    campos_sync: ['nome_completo', 'email', 'telefone', 'cargo', 'departamento'],
    sync_automatico: false,
    intervalo_minutos: 60,
  });

  const [syncEmAndamento, setSyncEmAndamento] = useState(false);
  const [resultadoSync, setResultadoSync] = useState<ResultadoSync | null>(null);
  const [conexaoTestada, setConexaoTestada] = useState<boolean | null>(null);

  // Carregar configuração existente
  useEffect(() => {
    if (configAtual) {
      setConfig(configAtual);
    }
  }, [configAtual]);

  // Sincronizar config local com autoSyncConfig
  useEffect(() => {
    if (autoSyncConfig) {
      setConfig(prev => ({
        ...prev,
        sync_automatico: autoSyncConfig.habilitado,
        intervalo_minutos: autoSyncConfig.intervalo_minutos,
      }));
    }
  }, [autoSyncConfig]);

  const handleSalvar = async () => {
    try {
      // ✅ VALIDAÇÃO ZOD
      const configSchema = z.object({
        webhook_url: z.string().url('URL do webhook inválida').min(10),
        intervalo_minutos: z.number().min(5, 'Mínimo 5 minutos').max(1440),
      });
      const validation = configSchema.safeParse({ webhook_url: config.webhook_url, intervalo_minutos: config.intervalo_minutos });
      if (!validation.success) {
        toast.error('Configuração inválida', { description: validation.error.errors[0]?.message });
        return;
      }
      await salvarConfiguracao(config);
      
      // Atualizar configuração de auto-sync
      await atualizarAutoSyncConfig({
        habilitado: config.sync_automatico,
        intervalo_minutos: config.intervalo_minutos,
        sync_colaboradores: true,
        sync_departamentos: true,
      });
    } catch (err: unknown) {
      toast.error('Erro ao salvar: ' + err.message);
    }
  };

  const handleTestarConexao = async () => {
    try {
      const resultado = await testarConexao(config.webhook_url);
      setConexaoTestada(resultado);
      if (resultado) {
        toast.success('Conexão estabelecida com sucesso!');
      } else {
        toast.error('Falha ao conectar com Bitrix24');
      }
    } catch (err: unknown) {
      setConexaoTestada(false);
      toast.error('Erro: ' + err.message);
    }
  };

  const handleSync = async (direcao: DirecaoSync) => {
    setSyncEmAndamento(true);
    setResultadoSync(null);
    try {
      let resultado: ResultadoSync;
      if (direcao === 'importar') {
        resultado = await importarDoBitrix();
      } else if (direcao === 'exportar') {
        resultado = await exportarParaBitrix();
      } else {
        resultado = await sincronizarBidirecional();
      }
      setResultadoSync(resultado);
      if (resultado.erros === 0) {
        toast.success(`Sincronização concluída: ${resultado.sucesso} registros processados`);
      } else {
        toast.warning(`Sincronização com alertas: ${resultado.sucesso} ok, ${resultado.erros} erros`);
      }
    } catch (err: unknown) {
      toast.error('Erro na sincronização: ' + err.message);
    } finally {
      setSyncEmAndamento(false);
    }
  };

  const handleToggleAutoSync = async () => {
    const novoEstado = !config.sync_automatico;
    setConfig(prev => ({ ...prev, sync_automatico: novoEstado }));
    await toggleAutoSync(novoEstado);
  };

  if (loadingConfig) {
    return (
    <>
      <SEOHead title="Configuração Bitrix24 | DP System" description="Configuração de integração" />
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Configuração Bitrix24 | DP System" description="Configuração de integração" />
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Link2 className="w-8 h-8" />
            Integração Bitrix24
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure a sincronização de dados com o Bitrix24
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AutoSyncStatusBadge />
          <Button onClick={handleSalvar} disabled={isUpdatingAutoSync}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>

      <Tabs defaultValue="config" className="space-y-4">
        <TabsList>
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="sync">Sincronização</TabsTrigger>
          <TabsTrigger value="auto">Auto-Sync</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        {/* Tab Configuração */}
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conexão</CardTitle>
              <CardDescription>Configure a URL do webhook do Bitrix24</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook">Webhook URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhook"
                    placeholder="https://seu-dominio.bitrix24.com.br/rest/..."
                    value={config.webhook_url}
                    onChange={(e) => setConfig(prev => ({ ...prev, webhook_url: e.target.value }))}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleTestarConexao}
                    disabled={isTestando || !config.webhook_url}
                  >
                    {isTestando ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <TestTube className="w-4 h-4" />
                    )}
                    <span className="ml-2">Testar</span>
                  </Button>
                </div>
                {conexaoTestada !== null && (
                  <div className={cn(
                    "flex items-center gap-2 text-sm",
                    conexaoTestada ? "text-success" : "text-destructive"
                  )}>
                    {conexaoTestada ? (
                      <><CheckCircle className="w-4 h-4" /> Conexão OK</>
                    ) : (
                      <><XCircle className="w-4 h-4" /> Falha na conexão</>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Campos para Sincronizar</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {CAMPOS_DISPONIVEIS.map(campo => (
                    <div key={campo.id} className="flex items-center gap-2">
                      <Switch
                        checked={config.campos_sync.includes(campo.id)}
                        onCheckedChange={(checked) => {
                          setConfig(prev => ({
                            ...prev,
                            campos_sync: checked
                              ? [...prev.campos_sync, campo.id]
                              : prev.campos_sync.filter(c => c !== campo.id)
                          }));
                        }}
                      />
                      <span className="text-sm">{campo.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Sincronização Manual */}
        <TabsContent value="sync" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => !syncEmAndamento && handleSync('importar')}>
              <CardContent className="pt-6 text-center">
                <Download className="w-12 h-12 mx-auto mb-4 text-info" />
                <h3 className="font-semibold">Importar do Bitrix24</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Trazer dados do Bitrix24 para o sistema
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => !syncEmAndamento && handleSync('exportar')}>
              <CardContent className="pt-6 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-success" />
                <h3 className="font-semibold">Exportar para Bitrix24</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Enviar dados do sistema para o Bitrix24
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => !syncEmAndamento && handleSync('bidirecional')}>
              <CardContent className="pt-6 text-center">
                <ArrowRightLeft className="w-12 h-12 mx-auto mb-4 text-warning" />
                <h3 className="font-semibold">Sincronização Bidirecional</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Sincronizar em ambas as direções
                </p>
              </CardContent>
            </Card>
          </div>

          {syncEmAndamento && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sincronizando...</span>
                    <span className="text-sm text-muted-foreground">{syncProgress}%</span>
                  </div>
                  <Progress value={syncProgress} />
                </div>
              </CardContent>
            </Card>
          )}

          {resultadoSync && (
            <Alert variant={resultadoSync.erros > 0 ? "destructive" : "default"}>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Sincronização concluída: {resultadoSync.sucesso} sucesso, {resultadoSync.erros} erros, {resultadoSync.conflitos} conflitos
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Tab Auto-Sync */}
        <TabsContent value="auto" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Sincronização Automática
              </CardTitle>
              <CardDescription>
                Configure a sincronização automática com o Bitrix24
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Habilitar Auto-Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Sincronizar automaticamente em intervalos regulares
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <AutoSyncStatusBadge />
                  <Switch
                    checked={config.sync_automatico}
                    onCheckedChange={handleToggleAutoSync}
                  />
                </div>
              </div>

              {config.sync_automatico && (
                <>
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Intervalo de Sincronização</Label>
                      <Select
                        value={String(config.intervalo_minutos)}
                        onValueChange={(v) => setConfig(prev => ({ ...prev, intervalo_minutos: parseInt(v) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">A cada 15 minutos</SelectItem>
                          <SelectItem value="30">A cada 30 minutos</SelectItem>
                          <SelectItem value="60">A cada 1 hora</SelectItem>
                          <SelectItem value="120">A cada 2 horas</SelectItem>
                          <SelectItem value="360">A cada 6 horas</SelectItem>
                          <SelectItem value="720">A cada 12 horas</SelectItem>
                          <SelectItem value="1440">A cada 24 horas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <div className="p-3 bg-muted rounded-lg">
                        {autoSyncStatus.rodando ? (
                          <div className="flex items-center gap-2 text-info">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sincronizando...</span>
                          </div>
                        ) : autoSyncStatus.proximaExecucao ? (
                          <div className="text-sm">
                            <p>Próxima execução:</p>
                            <p className="font-medium">
                              {format(autoSyncStatus.proximaExecucao, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Aguardando...</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={executarSyncManual} disabled={autoSyncStatus.rodando}>
                      <Play className="w-4 h-4 mr-2" />
                      Executar Agora
                    </Button>
                  </div>

                  {autoSyncStatus.ultimoResultado && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Última sincronização: {autoSyncStatus.ultimoResultado.sucesso} registros sincronizados
                        {autoSyncStatus.ultimaExecucao && (
                          <span className="ml-2 text-muted-foreground">
                            ({format(autoSyncStatus.ultimaExecucao, "dd/MM HH:mm", { locale: ptBR })})
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Histórico */}
        <TabsContent value="historico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Histórico de Sincronizações
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingHistorico ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : !historico || historico.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma sincronização realizada ainda
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {historico.map((log: unknown) => (
                      <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            log.registros_erro > 0 ? "bg-destructive" : "bg-success"
                          )} />
                          <div>
                            <p className="font-medium text-sm">
                              {log.tipo === 'auto' ? 'Automático' : 'Manual'} - {log.direcao}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {log.registros_sucesso} sucesso, {log.registros_erro} erros
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(log.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
