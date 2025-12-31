/**
 * Gerenciador de Whitelist e Bloqueio de IPs
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  Plus, 
  Trash2, 
  Loader2,
  Globe,
  Clock,
  Ban,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WhitelistedIP {
  id: string;
  ip_address: string;
  description: string | null;
  added_by: string | null;
  created_at: string;
}

interface BlockedIP {
  id: string;
  ip_address: string;
  reason: string | null;
  blocked_at: string | null;
  expires_at: string | null;
  permanent: boolean | null;
  blocked_by: string | null;
  created_at: string;
}

export function IPWhitelistManager() {
  const [activeTab, setActiveTab] = useState('whitelist');
  const [isAddingWhitelist, setIsAddingWhitelist] = useState(false);
  const [isAddingBlocked, setIsAddingBlocked] = useState(false);
  const [newWhitelistIP, setNewWhitelistIP] = useState({ ip: '', description: '' });
  const [newBlockedIP, setNewBlockedIP] = useState({ 
    ip: '', 
    reason: '', 
    permanent: true, 
    expiresInHours: 24 
  });
  
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar IPs na whitelist
  const { data: whitelistedIPs = [], isLoading: loadingWhitelist } = useQuery({
    queryKey: ['ip-whitelist'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ip_whitelist')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as WhitelistedIP[];
    },
  });

  // Buscar IPs bloqueados
  const { data: blockedIPs = [], isLoading: loadingBlocked } = useQuery({
    queryKey: ['blocked-ips'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blocked_ips')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BlockedIP[];
    },
  });

  // Adicionar IP à whitelist
  const addToWhitelistMutation = useMutation({
    mutationFn: async ({ ip, description }: { ip: string; description: string }) => {
      const { error } = await supabase
        .from('ip_whitelist')
        .insert({
          ip_address: ip,
          description: description || null,
          added_by: user?.id
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('IP adicionado à whitelist');
      setNewWhitelistIP({ ip: '', description: '' });
      setIsAddingWhitelist(false);
      queryClient.invalidateQueries({ queryKey: ['ip-whitelist'] });
    },
    onError: (error: Error) => {
      toast.error(`Erro ao adicionar IP: ${error.message}`);
    }
  });

  // Remover IP da whitelist
  const removeFromWhitelistMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ip_whitelist')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('IP removido da whitelist');
      queryClient.invalidateQueries({ queryKey: ['ip-whitelist'] });
    },
    onError: () => {
      toast.error('Erro ao remover IP');
    }
  });

  // Bloquear IP
  const blockIPMutation = useMutation({
    mutationFn: async ({ ip, reason, permanent, expiresInHours }: { 
      ip: string; 
      reason: string; 
      permanent: boolean; 
      expiresInHours: number 
    }) => {
      const expiresAt = permanent 
        ? null 
        : new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString();
      
      const { error } = await supabase
        .from('blocked_ips')
        .insert({
          ip_address: ip,
          reason: reason || null,
          permanent,
          expires_at: expiresAt,
          blocked_by: user?.id,
          blocked_at: new Date().toISOString()
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('IP bloqueado com sucesso');
      setNewBlockedIP({ ip: '', reason: '', permanent: true, expiresInHours: 24 });
      setIsAddingBlocked(false);
      queryClient.invalidateQueries({ queryKey: ['blocked-ips'] });
    },
    onError: (error: Error) => {
      toast.error(`Erro ao bloquear IP: ${error.message}`);
    }
  });

  // Desbloquear IP
  const unblockIPMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blocked_ips')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('IP desbloqueado');
      queryClient.invalidateQueries({ queryKey: ['blocked-ips'] });
    },
    onError: () => {
      toast.error('Erro ao desbloquear IP');
    }
  });

  // Validar formato de IP
  const isValidIP = (ip: string): boolean => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip) || cidrRegex.test(ip);
  };

  const isExpired = (expiresAt: string | null): boolean => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Gerenciamento de IPs
        </CardTitle>
        <CardDescription>
          Configure IPs permitidos (whitelist) e bloqueados para acesso ao sistema
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="whitelist" className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              Whitelist ({whitelistedIPs.length})
            </TabsTrigger>
            <TabsTrigger value="blocked" className="gap-2">
              <ShieldX className="h-4 w-4" />
              Bloqueados ({blockedIPs.length})
            </TabsTrigger>
          </TabsList>

          {/* Whitelist Tab */}
          <TabsContent value="whitelist" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                IPs na whitelist têm acesso garantido ao sistema
              </p>
              <Dialog open={isAddingWhitelist} onOpenChange={setIsAddingWhitelist}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar IP
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar IP à Whitelist</DialogTitle>
                    <DialogDescription>
                      Adicione um endereço IP que terá acesso garantido ao sistema
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="whitelist-ip">Endereço IP</Label>
                      <Input
                        id="whitelist-ip"
                        placeholder="Ex: 192.168.1.1 ou 10.0.0.0/24"
                        value={newWhitelistIP.ip}
                        onChange={(e) => setNewWhitelistIP(prev => ({ ...prev, ip: e.target.value }))}
                      />
                      {newWhitelistIP.ip && !isValidIP(newWhitelistIP.ip) && (
                        <p className="text-xs text-destructive">Formato de IP inválido</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whitelist-desc">Descrição (opcional)</Label>
                      <Input
                        id="whitelist-desc"
                        placeholder="Ex: Escritório principal"
                        value={newWhitelistIP.description}
                        onChange={(e) => setNewWhitelistIP(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingWhitelist(false)}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => addToWhitelistMutation.mutate(newWhitelistIP)}
                      disabled={!newWhitelistIP.ip || !isValidIP(newWhitelistIP.ip) || addToWhitelistMutation.isPending}
                    >
                      {addToWhitelistMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                      )}
                      Adicionar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {loadingWhitelist ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {whitelistedIPs.map(ip => (
                    <div
                      key={ip.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Globe className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono font-medium">
                              {ip.ip_address}
                            </code>
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Permitido
                            </Badge>
                          </div>
                          {ip.description && (
                            <p className="text-sm text-muted-foreground">{ip.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Adicionado em {format(new Date(ip.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      </div>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover IP da whitelist?</AlertDialogTitle>
                            <AlertDialogDescription>
                              O IP {ip.ip_address} será removido da whitelist e poderá ser bloqueado normalmente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeFromWhitelistMutation.mutate(ip.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}

                  {whitelistedIPs.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShieldCheck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhum IP na whitelist</p>
                      <p className="text-sm">Adicione IPs para garantir acesso ao sistema</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          {/* Blocked IPs Tab */}
          <TabsContent value="blocked" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                IPs bloqueados não podem acessar o sistema
              </p>
              <Dialog open={isAddingBlocked} onOpenChange={setIsAddingBlocked}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    <Ban className="h-4 w-4 mr-2" />
                    Bloquear IP
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bloquear Endereço IP</DialogTitle>
                    <DialogDescription>
                      Bloquear um IP impede qualquer acesso ao sistema a partir deste endereço
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="blocked-ip">Endereço IP</Label>
                      <Input
                        id="blocked-ip"
                        placeholder="Ex: 192.168.1.1"
                        value={newBlockedIP.ip}
                        onChange={(e) => setNewBlockedIP(prev => ({ ...prev, ip: e.target.value }))}
                      />
                      {newBlockedIP.ip && !isValidIP(newBlockedIP.ip) && (
                        <p className="text-xs text-destructive">Formato de IP inválido</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blocked-reason">Motivo do bloqueio</Label>
                      <Textarea
                        id="blocked-reason"
                        placeholder="Ex: Tentativas de acesso suspeitas"
                        value={newBlockedIP.reason}
                        onChange={(e) => setNewBlockedIP(prev => ({ ...prev, reason: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Bloqueio permanente</Label>
                        <p className="text-xs text-muted-foreground">
                          O IP permanecerá bloqueado indefinidamente
                        </p>
                      </div>
                      <Switch
                        checked={newBlockedIP.permanent}
                        onCheckedChange={(checked) => setNewBlockedIP(prev => ({ ...prev, permanent: checked }))}
                      />
                    </div>
                    {!newBlockedIP.permanent && (
                      <div className="space-y-2">
                        <Label htmlFor="expires">Expirar após (horas)</Label>
                        <Input
                          id="expires"
                          type="number"
                          min={1}
                          value={newBlockedIP.expiresInHours}
                          onChange={(e) => setNewBlockedIP(prev => ({ ...prev, expiresInHours: parseInt(e.target.value) || 24 }))}
                        />
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingBlocked(false)}>
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => blockIPMutation.mutate(newBlockedIP)}
                      disabled={!newBlockedIP.ip || !isValidIP(newBlockedIP.ip) || blockIPMutation.isPending}
                    >
                      {blockIPMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Ban className="h-4 w-4 mr-2" />
                      )}
                      Bloquear
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {loadingBlocked ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {blockedIPs.map(ip => {
                    const expired = isExpired(ip.expires_at);
                    
                    return (
                      <div
                        key={ip.id}
                        className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                          expired ? 'opacity-60 bg-muted/30' : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${expired ? 'bg-muted' : 'bg-destructive/10'}`}>
                            <Ban className={`h-4 w-4 ${expired ? 'text-muted-foreground' : 'text-destructive'}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <code className="text-sm font-mono font-medium">
                                {ip.ip_address}
                              </code>
                              {ip.permanent ? (
                                <Badge variant="destructive" className="text-xs">
                                  Permanente
                                </Badge>
                              ) : expired ? (
                                <Badge variant="secondary" className="text-xs">
                                  Expirado
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Temporário
                                </Badge>
                              )}
                            </div>
                            {ip.reason && (
                              <p className="text-sm text-muted-foreground">{ip.reason}</p>
                            )}
                            <div className="flex gap-2 text-xs text-muted-foreground">
                              <span>
                                Bloqueado em {format(new Date(ip.blocked_at || ip.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </span>
                              {ip.expires_at && (
                                <span>
                                  • Expira em {format(new Date(ip.expires_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <ShieldCheck className="h-4 w-4 mr-2" />
                              Desbloquear
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Desbloquear IP?</AlertDialogTitle>
                              <AlertDialogDescription>
                                O IP {ip.ip_address} poderá acessar o sistema novamente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => unblockIPMutation.mutate(ip.id)}>
                                Desbloquear
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    );
                  })}

                  {blockedIPs.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShieldX className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhum IP bloqueado</p>
                      <p className="text-sm">O sistema está acessível para todos os IPs</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default IPWhitelistManager;
