import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { KeyRound, Check, X, Clock, AlertTriangle, Settings, History } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ResetRequest {
  id: string;
  user_id: string;
  user_email: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'completed';
  reason: string | null;
  requested_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  reviewer_notes: string | null;
  expires_at: string;
  ip_address: string | null;
}

interface ResetConfig {
  id: string;
  require_approval: boolean;
  auto_expire_hours: number;
  notify_admins: boolean;
  notify_user_on_approval: boolean;
  notify_user_on_rejection: boolean;
}

const STATUS_CONFIG = {
  pending: { label: 'Pendente', variant: 'secondary' as const, icon: Clock },
  approved: { label: 'Aprovado', variant: 'default' as const, icon: Check },
  rejected: { label: 'Rejeitado', variant: 'destructive' as const, icon: X },
  expired: { label: 'Expirado', variant: 'outline' as const, icon: AlertTriangle },
  completed: { label: 'Concluído', variant: 'default' as const, icon: Check },
};

export function PasswordResetApprovalManager() {
  const [config, setConfig] = useState<ResetConfig | null>(null);
  const [requests, setRequests] = useState<ResetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ResetRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Carregar configuração
      const { data: configData } = await supabase
        .from('password_reset_config')
        .select('*')
        .single();

      if (configData) {
        setConfig(configData);
      }

      // Carregar solicitações
      const { data: requestsData } = await supabase
        .from('password_reset_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (requestsData) {
        setRequests(requestsData as ResetRequest[]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (field: keyof ResetConfig, value: boolean | number) => {
    if (!config) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('password_reset_config')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', config.id);

      if (error) throw error;

      setConfig({ ...config, [field]: value });
      toast.success('Configuração atualizada');
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      toast.error('Erro ao atualizar configuração');
    } finally {
      setSaving(false);
    }
  };

  const openReviewDialog = (request: ResetRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    setReviewNotes('');
    setDialogOpen(true);
  };

  const handleReview = async () => {
    if (!selectedRequest) return;

    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();

      const newStatus = actionType === 'approve' ? 'approved' : 'rejected';

      const { error } = await supabase
        .from('password_reset_requests')
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
          reviewer_notes: reviewNotes || null,
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      // Se aprovado, enviar email de reset via Supabase Auth
      if (actionType === 'approve') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          selectedRequest.user_email,
          { redirectTo: `${window.location.origin}/reset-password` }
        );

        if (resetError) {
          console.error('Erro ao enviar email de reset:', resetError);
          toast.error('Solicitação aprovada, mas houve erro ao enviar email');
        } else {
          toast.success('Solicitação aprovada e email de reset enviado');
        }
      } else {
        toast.success('Solicitação rejeitada');
      }

      setDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Erro ao processar:', error);
      toast.error('Erro ao processar solicitação');
    } finally {
      setSaving(false);
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configuração */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            <CardTitle>Reset de Senha com Aprovação</CardTitle>
          </div>
          <CardDescription>
            Configure o fluxo de aprovação para solicitações de reset de senha
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
            <div className="space-y-1">
              <Label className="text-base font-medium">Exigir Aprovação</Label>
              <p className="text-sm text-muted-foreground">
                Solicitações de reset precisam de aprovação de um administrador
              </p>
            </div>
            <Switch
              checked={config?.require_approval ?? true}
              onCheckedChange={(checked) => updateConfig('require_approval', checked)}
              disabled={saving}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Expiração automática (horas)</Label>
              <Input
                type="number"
                min={1}
                max={168}
                value={config?.auto_expire_hours ?? 24}
                onChange={(e) => updateConfig('auto_expire_hours', parseInt(e.target.value))}
                disabled={saving}
              />
              <p className="text-xs text-muted-foreground">
                Solicitações pendentes expiram após este período
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Notificar admins</Label>
                <Switch
                  checked={config?.notify_admins ?? true}
                  onCheckedChange={(checked) => updateConfig('notify_admins', checked)}
                  disabled={saving}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Notificar usuário (aprovação)</Label>
                <Switch
                  checked={config?.notify_user_on_approval ?? true}
                  onCheckedChange={(checked) => updateConfig('notify_user_on_approval', checked)}
                  disabled={saving}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Notificar usuário (rejeição)</Label>
                <Switch
                  checked={config?.notify_user_on_rejection ?? true}
                  onCheckedChange={(checked) => updateConfig('notify_user_on_rejection', checked)}
                  disabled={saving}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Solicitações */}
      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pendentes ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Histórico ({processedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Solicitações Pendentes</CardTitle>
              <CardDescription>
                Aprove ou rejeite as solicitações de reset de senha
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Check className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Nenhuma solicitação pendente</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Solicitado em</TableHead>
                      <TableHead>Expira em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.user_email}</p>
                            {request.ip_address && (
                              <p className="text-xs text-muted-foreground">IP: {request.ip_address}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {request.reason || '-'}
                        </TableCell>
                        <TableCell>
                          {format(new Date(request.requested_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(request.expires_at), { locale: ptBR, addSuffix: true })}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => openReviewDialog(request, 'approve')}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openReviewDialog(request, 'reject')}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Rejeitar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Histórico</CardTitle>
              <CardDescription>
                Solicitações processadas anteriormente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {processedRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <History className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Nenhum histórico</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Solicitado em</TableHead>
                      <TableHead>Revisado em</TableHead>
                      <TableHead>Notas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedRequests.map((request) => {
                      const statusConfig = STATUS_CONFIG[request.status];
                      const StatusIcon = statusConfig.icon;
                      return (
                        <TableRow key={request.id}>
                          <TableCell>{request.user_email}</TableCell>
                          <TableCell>
                            <Badge variant={statusConfig.variant} className="flex items-center gap-1 w-fit">
                              <StatusIcon className="h-3 w-3" />
                              {statusConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(request.requested_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                          </TableCell>
                          <TableCell>
                            {request.reviewed_at
                              ? format(new Date(request.reviewed_at), "dd/MM/yyyy HH:mm", { locale: ptBR })
                              : '-'}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {request.reviewer_notes || '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de revisão */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Aprovar Solicitação' : 'Rejeitar Solicitação'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? 'Ao aprovar, um email de reset de senha será enviado ao usuário.'
                : 'Ao rejeitar, o usuário será notificado e precisará solicitar novamente.'}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border bg-muted/50">
                <p className="text-sm text-muted-foreground">Usuário</p>
                <p className="font-medium">{selectedRequest.user_email}</p>
                {selectedRequest.reason && (
                  <>
                    <p className="text-sm text-muted-foreground mt-2">Motivo informado</p>
                    <p className="text-sm">{selectedRequest.reason}</p>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label>Notas do revisor (opcional)</Label>
                <Textarea
                  placeholder="Adicione observações sobre esta decisão..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant={actionType === 'approve' ? 'default' : 'destructive'}
              onClick={handleReview}
              disabled={saving}
            >
              {saving ? 'Processando...' : actionType === 'approve' ? 'Aprovar' : 'Rejeitar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
