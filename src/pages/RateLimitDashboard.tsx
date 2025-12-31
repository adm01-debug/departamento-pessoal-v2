/**
 * @fileoverview Dashboard de Rate Limiting e Segurança
 * @module pages/RateLimitDashboard
 */
import { SEOHead } from '@/components/SEOHead';
import { useState, memo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, AlertTriangle, Ban, CheckCircle, Activity, 
  RefreshCw, Trash2, Plus, Search, Clock, Globe,
  TrendingUp, Users, Lock, Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import MainLayout from '@/components/MainLayout';

interface BlockedIP {
  id: string;
  ip_address: string;
  reason: string;
  blocked_at: string;
  expires_at: string | null;
  permanent: boolean;
}

interface WhitelistIP {
  id: string;
  ip_address: string;
  description: string;
  created_at: string;
}

interface SecurityAlert {
  id: string;
  type: string;
  severity: string;
  ip_address: string;
  details: Record<string, any>;
  resolved: boolean;
  created_at: string;
}

interface RateLimitConfig {
  id: string;
  endpoint: string;
  max_requests: number;
  window_seconds: number;
  block_duration_seconds: number;
  enabled: boolean;
}

const RateLimitDashboard = memo(function RateLimitDashboard() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [newBlockIP, setNewBlockIP] = useState({ ip: '', reason: '', permanent: false });
  const [newWhitelistIP, setNewWhitelistIP] = useState({ ip: '', description: '' });
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isWhitelistDialogOpen, setIsWhitelistDialogOpen] = useState(false);

  // Fetch blocked IPs
  const { data: blockedIPs = [], isLoading: loadingBlocked } = useQuery({
    queryKey: ['blocked-ips'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blocked_ips')
        .select('*')
        .order('blocked_at', { ascending: false });
      if (error) throw error;
      return data as BlockedIP[];
    },
  });

  // Fetch whitelist IPs
  const { data: whitelistIPs = [], isLoading: loadingWhitelist } = useQuery({
    queryKey: ['whitelist-ips'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ip_whitelist')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as WhitelistIP[];
    },
  });

  // Fetch security alerts
  const { data: securityAlerts = [], isLoading: loadingAlerts } = useQuery({
    queryKey: ['security-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as SecurityAlert[];
    },
  });

  // Fetch rate limit configs
  const { data: rateLimitConfigs = [], isLoading: loadingConfigs } = useQuery({
    queryKey: ['rate-limit-configs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rate_limit_config')
        .select('*')
        .order('endpoint');
      if (error) throw error;
      return data as RateLimitConfig[];
    },
  });

  // Block IP mutation
  const blockIPMutation = useMutation({
    mutationFn: async (data: { ip: string; reason: string; permanent: boolean }) => {
      const { error } = await supabase.from('blocked_ips').insert({
        ip_address: data.ip,
        reason: data.reason,
        permanent: data.permanent,
        expires_at: data.permanent ? null : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-ips'] });
      toast.success('IP bloqueado com sucesso');
      setIsBlockDialogOpen(false);
      setNewBlockIP({ ip: '', reason: '', permanent: false });
    },
    onError: () => {
      toast.error('Erro ao bloquear IP');
    },
  });

  // Unblock IP mutation
  const unblockIPMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blocked_ips').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-ips'] });
      toast.success('IP desbloqueado');
    },
  });

  // Add to whitelist mutation
  const addWhitelistMutation = useMutation({
    mutationFn: async (data: { ip: string; description: string }) => {
      const { error } = await supabase.from('ip_whitelist').insert({
        ip_address: data.ip,
        description: data.description,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whitelist-ips'] });
      toast.success('IP adicionado à whitelist');
      setIsWhitelistDialogOpen(false);
      setNewWhitelistIP({ ip: '', description: '' });
    },
    onError: () => {
      toast.error('Erro ao adicionar IP');
    },
  });

  // Remove from whitelist mutation
  const removeWhitelistMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('ip_whitelist').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whitelist-ips'] });
      toast.success('IP removido da whitelist');
    },
  });

  // Resolve alert mutation
  const resolveAlertMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('security_alerts')
        .update({ resolved: true, resolved_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-alerts'] });
      toast.success('Alerta resolvido');
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'brute_force': return 'Força Bruta';
      case 'rate_limit_exceeded': return 'Rate Limit Excedido';
      case 'suspicious_activity': return 'Atividade Suspeita';
      default: return type;
    }
  };

  const stats = {
    blockedIPs: blockedIPs.length,
    whitelistIPs: whitelistIPs.length,
    activeAlerts: securityAlerts.filter(a => !a.resolved).length,
    criticalAlerts: securityAlerts.filter(a => a.severity === 'critical' && !a.resolved).length,
  };

  return (
    <MainLayout>
      <SEOHead title="Rate Limiting" description="Dashboard de segurança e rate limiting" />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Segurança & Rate Limiting</h1>
            <p className="text-muted-foreground">Monitore e gerencie a segurança do sistema</p>
          </div>
          <Button onClick={() => queryClient.invalidateQueries()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Ban className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.blockedIPs}</p>
                <p className="text-sm text-muted-foreground">IPs Bloqueados</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.whitelistIPs}</p>
                <p className="text-sm text-muted-foreground">IPs na Whitelist</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeAlerts}</p>
                <p className="text-sm text-muted-foreground">Alertas Ativos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.criticalAlerts}</p>
                <p className="text-sm text-muted-foreground">Alertas Críticos</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="alerts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="alerts" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Alertas
            </TabsTrigger>
            <TabsTrigger value="blocked" className="gap-2">
              <Ban className="w-4 h-4" />
              IPs Bloqueados
            </TabsTrigger>
            <TabsTrigger value="whitelist" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Whitelist
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2">
              <Activity className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Alertas de Segurança</CardTitle>
                <CardDescription>Monitore atividades suspeitas e tentativas de ataque</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Severidade</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Detalhes</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium">
                          {getAlertTypeLabel(alert.type)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{alert.ip_address}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {JSON.stringify(alert.details)}
                        </TableCell>
                        <TableCell>
                          {format(new Date(alert.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          {alert.resolved ? (
                            <Badge variant="outline" className="text-green-500 border-green-500">
                              Resolvido
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-amber-500 border-amber-500">
                              Ativo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {!alert.resolved && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => resolveAlertMutation.mutate(alert.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blocked IPs Tab */}
          <TabsContent value="blocked">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>IPs Bloqueados</CardTitle>
                  <CardDescription>Gerencie IPs bloqueados no sistema</CardDescription>
                </div>
                <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Bloquear IP
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Bloquear IP</DialogTitle>
                      <DialogDescription>Adicione um IP à lista de bloqueio</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Endereço IP</Label>
                        <Input
                          placeholder="192.168.1.1"
                          value={newBlockIP.ip}
                          onChange={(e) => setNewBlockIP({ ...newBlockIP, ip: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Motivo</Label>
                        <Input
                          placeholder="Atividade suspeita..."
                          value={newBlockIP.reason}
                          onChange={(e) => setNewBlockIP({ ...newBlockIP, reason: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Bloqueio permanente</Label>
                        <Switch
                          checked={newBlockIP.permanent}
                          onCheckedChange={(checked) => setNewBlockIP({ ...newBlockIP, permanent: checked })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsBlockDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={() => blockIPMutation.mutate(newBlockIP)}>
                        Bloquear
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>IP</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Bloqueado em</TableHead>
                      <TableHead>Expira em</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blockedIPs.map((ip) => (
                      <TableRow key={ip.id}>
                        <TableCell className="font-mono">{ip.ip_address}</TableCell>
                        <TableCell>{ip.reason}</TableCell>
                        <TableCell>
                          {format(new Date(ip.blocked_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          {ip.expires_at
                            ? format(new Date(ip.expires_at), "dd/MM/yyyy HH:mm", { locale: ptBR })
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant={ip.permanent ? 'destructive' : 'outline'}>
                            {ip.permanent ? 'Permanente' : 'Temporário'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => unblockIPMutation.mutate(ip.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Whitelist Tab */}
          <TabsContent value="whitelist">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>IP Whitelist</CardTitle>
                  <CardDescription>IPs que nunca serão bloqueados pelo rate limiting</CardDescription>
                </div>
                <Dialog open={isWhitelistDialogOpen} onOpenChange={setIsWhitelistDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar IP
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar à Whitelist</DialogTitle>
                      <DialogDescription>Adicione um IP confiável à lista</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Endereço IP</Label>
                        <Input
                          placeholder="192.168.1.1"
                          value={newWhitelistIP.ip}
                          onChange={(e) => setNewWhitelistIP({ ...newWhitelistIP, ip: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Descrição</Label>
                        <Input
                          placeholder="Servidor de produção..."
                          value={newWhitelistIP.description}
                          onChange={(e) => setNewWhitelistIP({ ...newWhitelistIP, description: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsWhitelistDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={() => addWhitelistMutation.mutate(newWhitelistIP)}>
                        Adicionar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>IP</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Adicionado em</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {whitelistIPs.map((ip) => (
                      <TableRow key={ip.id}>
                        <TableCell className="font-mono">{ip.ip_address}</TableCell>
                        <TableCell>{ip.description}</TableCell>
                        <TableCell>
                          {format(new Date(ip.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeWhitelistMutation.mutate(ip.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Config Tab */}
          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Rate Limit</CardTitle>
                <CardDescription>Defina limites de requisições por endpoint</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Máx. Requisições</TableHead>
                      <TableHead>Janela (seg)</TableHead>
                      <TableHead>Bloqueio (seg)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rateLimitConfigs.map((config) => (
                      <TableRow key={config.id}>
                        <TableCell className="font-mono">{config.endpoint}</TableCell>
                        <TableCell>{config.max_requests}</TableCell>
                        <TableCell>{config.window_seconds}</TableCell>
                        <TableCell>{config.block_duration_seconds}</TableCell>
                        <TableCell>
                          <Badge variant={config.enabled ? 'default' : 'secondary'}>
                            {config.enabled ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
});

export default RateLimitDashboard;
