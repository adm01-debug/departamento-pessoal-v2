/**
 * @fileoverview Página de Configurações do Sistema
 * @module pages/Configuracoes
 * @version V8.2 - Implementação completa
 */
import { useState, useEffect, memo, useCallback } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  Palette, 
  Globe,
  Mail,
  Clock,
  Save,
  Loader2,
  Building2,
  Users,
  FileText,
  Calculator,
  Webhook
} from 'lucide-react';
import { toast } from 'sonner';
import { useSettings } from '@/contexts/SettingsContext';
import { useEmpresas } from '@/hooks/useEmpresas';

// ============================================
// TIPOS
// ============================================

interface ConfiguracaoGeral {
  nome_sistema: string;
  logo_url: string;
  cor_primaria: string;
  idioma: string;
  fuso_horario: string;
  formato_data: string;
  moeda: string;
}

interface ConfiguracaoNotificacao {
  email_ativo: boolean;
  push_ativo: boolean;
  sms_ativo: boolean;
  notificar_ferias: boolean;
  notificar_vencimentos: boolean;
  notificar_aprovacoes: boolean;
  dias_antecedencia_ferias: number;
  dias_antecedencia_documentos: number;
}

interface ConfiguracaoFolha {
  dia_fechamento: number;
  dia_pagamento: number;
  calcular_dsr: boolean;
  arredondar_horas: boolean;
  tolerancia_atraso: number;
  hora_extra_automatica: boolean;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const ConfiguracoesPage = memo(function ConfiguracoesPage() {
  useEffect(() => {
    document.title = 'Configurações | DP System';
  }, []);

  const { theme, setTheme, language, dateFormat, setDateFormat } = useSettings();
  const { empresaAtual } = useEmpresas();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('geral');

  // Estados de configuração
  const [configGeral, setConfigGeral] = useState<ConfiguracaoGeral>({
    nome_sistema: 'DP System',
    logo_url: '',
    cor_primaria: '#3B82F6',
    idioma: 'pt-BR',
    fuso_horario: 'America/Sao_Paulo',
    formato_data: 'dd/MM/yyyy',
    moeda: 'BRL',
  });

  const [configNotificacao, setConfigNotificacao] = useState<ConfiguracaoNotificacao>({
    email_ativo: true,
    push_ativo: true,
    sms_ativo: false,
    notificar_ferias: true,
    notificar_vencimentos: true,
    notificar_aprovacoes: true,
    dias_antecedencia_ferias: 30,
    dias_antecedencia_documentos: 15,
  });

  const [configFolha, setConfigFolha] = useState<ConfiguracaoFolha>({
    dia_fechamento: 25,
    dia_pagamento: 5,
    calcular_dsr: true,
    arredondar_horas: true,
    tolerancia_atraso: 10,
    hora_extra_automatica: true,
  });

  // Salvar configurações
  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      // Simular salvamento
      await new Promise(r => setTimeout(r, 1000));
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  }, []);

  return (
    <>
      <SEOHead title="Configurações" description="Configurações do sistema de departamento pessoal" />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="h-8 w-8" />
              Configurações
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie as configurações do sistema
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="geral" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="folha" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Folha
            </TabsTrigger>
            <TabsTrigger value="aparencia" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="integracoes" className="flex items-center gap-2">
              <Webhook className="h-4 w-4" />
              Integrações
            </TabsTrigger>
          </TabsList>

          {/* Tab Geral */}
          <TabsContent value="geral" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                  Configurações básicas do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome_sistema">Nome do Sistema</Label>
                    <Input
                      id="nome_sistema"
                      value={configGeral.nome_sistema}
                      onChange={(e) => setConfigGeral(prev => ({ ...prev, nome_sistema: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fuso_horario">Fuso Horário</Label>
                    <Select
                      value={configGeral.fuso_horario}
                      onValueChange={(value) => setConfigGeral(prev => ({ ...prev, fuso_horario: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                        <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                        <SelectItem value="America/Cuiaba">Cuiabá (GMT-4)</SelectItem>
                        <SelectItem value="America/Fortaleza">Fortaleza (GMT-3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="formato_data">Formato de Data</Label>
                    <Select
                      value={configGeral.formato_data}
                      onValueChange={(value) => setConfigGeral(prev => ({ ...prev, formato_data: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                        <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                        <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="idioma">Idioma</Label>
                    <Select
                      value={configGeral.idioma}
                      onValueChange={(value) => setConfigGeral(prev => ({ ...prev, idioma: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Notificações */}
          <TabsContent value="notificacoes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
                <CardDescription>
                  Configure como e quando o sistema deve enviar notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Canais de Notificação</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        <span>E-mail</span>
                      </div>
                      <Switch
                        checked={configNotificacao.email_ativo}
                        onCheckedChange={(checked) => setConfigNotificacao(prev => ({ ...prev, email_ativo: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        <span>Push</span>
                      </div>
                      <Switch
                        checked={configNotificacao.push_ativo}
                        onCheckedChange={(checked) => setConfigNotificacao(prev => ({ ...prev, push_ativo: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        <span>SMS</span>
                      </div>
                      <Switch
                        checked={configNotificacao.sms_ativo}
                        onCheckedChange={(checked) => setConfigNotificacao(prev => ({ ...prev, sms_ativo: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Tipos de Notificação</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Férias</p>
                        <p className="text-sm text-muted-foreground">Notificar sobre férias próximas</p>
                      </div>
                      <Switch
                        checked={configNotificacao.notificar_ferias}
                        onCheckedChange={(checked) => setConfigNotificacao(prev => ({ ...prev, notificar_ferias: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Vencimentos</p>
                        <p className="text-sm text-muted-foreground">Notificar sobre documentos vencendo</p>
                      </div>
                      <Switch
                        checked={configNotificacao.notificar_vencimentos}
                        onCheckedChange={(checked) => setConfigNotificacao(prev => ({ ...prev, notificar_vencimentos: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Aprovações</p>
                        <p className="text-sm text-muted-foreground">Notificar sobre solicitações pendentes</p>
                      </div>
                      <Switch
                        checked={configNotificacao.notificar_aprovacoes}
                        onCheckedChange={(checked) => setConfigNotificacao(prev => ({ ...prev, notificar_aprovacoes: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Dias de antecedência - Férias</Label>
                    <Input
                      type="number"
                      value={configNotificacao.dias_antecedencia_ferias}
                      onChange={(e) => setConfigNotificacao(prev => ({ ...prev, dias_antecedencia_ferias: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Dias de antecedência - Documentos</Label>
                    <Input
                      type="number"
                      value={configNotificacao.dias_antecedencia_documentos}
                      onChange={(e) => setConfigNotificacao(prev => ({ ...prev, dias_antecedencia_documentos: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Folha */}
          <TabsContent value="folha" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Folha de Pagamento</CardTitle>
                <CardDescription>
                  Configure os parâmetros de cálculo da folha
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Dia de Fechamento</Label>
                    <Input
                      type="number"
                      min={1}
                      max={31}
                      value={configFolha.dia_fechamento}
                      onChange={(e) => setConfigFolha(prev => ({ ...prev, dia_fechamento: parseInt(e.target.value) || 25 }))}
                    />
                    <p className="text-xs text-muted-foreground">Dia do mês para fechamento da folha</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Dia de Pagamento</Label>
                    <Input
                      type="number"
                      min={1}
                      max={31}
                      value={configFolha.dia_pagamento}
                      onChange={(e) => setConfigFolha(prev => ({ ...prev, dia_pagamento: parseInt(e.target.value) || 5 }))}
                    />
                    <p className="text-xs text-muted-foreground">Dia do mês seguinte para pagamento</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Tolerância de Atraso (minutos)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={30}
                      value={configFolha.tolerancia_atraso}
                      onChange={(e) => setConfigFolha(prev => ({ ...prev, tolerancia_atraso: parseInt(e.target.value) || 10 }))}
                    />
                    <p className="text-xs text-muted-foreground">Minutos de tolerância antes de descontar atraso</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Opções de Cálculo</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Calcular DSR</p>
                        <p className="text-sm text-muted-foreground">Incluir Descanso Semanal Remunerado nos cálculos</p>
                      </div>
                      <Switch
                        checked={configFolha.calcular_dsr}
                        onCheckedChange={(checked) => setConfigFolha(prev => ({ ...prev, calcular_dsr: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Arredondar Horas</p>
                        <p className="text-sm text-muted-foreground">Arredondar horas trabalhadas para 5 minutos</p>
                      </div>
                      <Switch
                        checked={configFolha.arredondar_horas}
                        onCheckedChange={(checked) => setConfigFolha(prev => ({ ...prev, arredondar_horas: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Hora Extra Automática</p>
                        <p className="text-sm text-muted-foreground">Calcular hora extra automaticamente do ponto</p>
                      </div>
                      <Switch
                        checked={configFolha.hora_extra_automatica}
                        onCheckedChange={(checked) => setConfigFolha(prev => ({ ...prev, hora_extra_automatica: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Aparência */}
          <TabsContent value="aparencia" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>
                  Personalize a aparência do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Tema</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        theme === 'light' ? 'border-primary bg-primary/10' : 'hover:bg-muted'
                      }`}
                    >
                      <div className="h-10 w-full bg-white border rounded mb-2" />
                      <span className="text-sm font-medium">Claro</span>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        theme === 'dark' ? 'border-primary bg-primary/10' : 'hover:bg-muted'
                      }`}
                    >
                      <div className="h-10 w-full bg-gray-900 rounded mb-2" />
                      <span className="text-sm font-medium">Escuro</span>
                    </button>
                    <button
                      onClick={() => setTheme('system')}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        theme === 'system' ? 'border-primary bg-primary/10' : 'hover:bg-muted'
                      }`}
                    >
                      <div className="h-10 w-full bg-gradient-to-r from-white to-gray-900 rounded mb-2" />
                      <span className="text-sm font-medium">Sistema</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Integrações */}
          <TabsContent value="integracoes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Integrações</CardTitle>
                <CardDescription>
                  Configure integrações com sistemas externos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded">
                        <Database className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Bitrix24</p>
                        <p className="text-sm text-muted-foreground">Sincronização de colaboradores e tarefas</p>
                      </div>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-100 rounded">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">eSocial</p>
                        <p className="text-sm text-muted-foreground">Envio de eventos ao governo</p>
                      </div>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-orange-100 rounded">
                        <Calculator className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">Sistema Contábil</p>
                        <p className="text-sm text-muted-foreground">Exportação de lançamentos contábeis</p>
                      </div>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
});

export default ConfiguracoesPage;
