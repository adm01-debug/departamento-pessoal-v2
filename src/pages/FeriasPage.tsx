import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyList } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { feriasService } from '@/services';
import { useEmpresas } from '@/hooks/useEmpresas';
import { useAuth } from '@/contexts';
import { Check, X, Calendar, UserCheck, Shield, Building2, Ban, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const workflowSteps = [
  { key: 'aprovado_gestor', label: 'Gestor', icon: UserCheck },
  { key: 'aprovado_rh', label: 'RH', icon: Shield },
  { key: 'enviado_contabilidade', label: 'Contabilidade', icon: Building2 },
];

export default function FeriasPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const qc = useQueryClient();
  const { empresaAtual } = useEmpresas();
  const { user } = useAuth();

  const { data: solicitacoes, isLoading } = useQuery({
    queryKey: ['ferias-solicitacoes', empresaAtual?.id],
    queryFn: () => feriasService.listSolicitacoes(empresaAtual?.id),
    enabled: !!empresaAtual?.id,
  });

  const aprovarGestor = useMutation({
    mutationFn: (id: string) => feriasService.aprovarGestor(id, user?.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ferias-solicitacoes'] }); toast.success('Aprovado pelo gestor'); },
  });

  const aprovarRH = useMutation({
    mutationFn: (id: string) => feriasService.aprovarRH(id, user?.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ferias-solicitacoes'] }); toast.success('Aprovado pelo RH'); },
  });

  const enviarContabilidade = useMutation({
    mutationFn: (id: string) => feriasService.enviarContabilidade(id, user?.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ferias-solicitacoes'] }); toast.success('Enviado à contabilidade'); },
  });

  const rejeitarMutation = useMutation({
    mutationFn: (id: string) => feriasService.rejeitar(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ferias-solicitacoes'] }); toast.success('Férias rejeitadas'); },
  });

  const cancelarMutation = useMutation({
    mutationFn: (id: string) => feriasService.cancelar(id, user?.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ferias-solicitacoes'] }); toast.success('Férias canceladas'); },
  });

  const statusOptions = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'aprovada', label: 'Aprovada' },
    { value: 'rejeitada', label: 'Rejeitada' },
    { value: 'em_gozo', label: 'Em Gozo' },
    { value: 'concluida', label: 'Concluída' },
    { value: 'cancelada', label: 'Cancelada' },
  ];

  const filtered = solicitacoes?.filter((s: Record<string, unknown>) =>
    !statusFilter || s.status === statusFilter
  );

  const stats = {
    total: solicitacoes?.length || 0,
    pendentes: solicitacoes?.filter((s: any) => s.status === 'pendente').length || 0,
    aprovadas: solicitacoes?.filter((s: any) => s.status === 'aprovada' || s.aprovado_rh).length || 0,
    abonoPecuniario: solicitacoes?.filter((s: any) => s.abono_pecuniario).length || 0,
  };

  return (
    <PageLayout
      title="Férias"
      description="Gestão de férias com workflow de aprovação em 3 níveis"
      icon={<Calendar className="h-5 w-5 text-primary-foreground" />}
      gradient="from-primary-glow to-primary"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border border-border/30 shadow-elevated rounded-2xl">
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-display font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground font-body">Total</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="border border-border/30 shadow-elevated rounded-2xl">
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-display font-bold text-warning">{stats.pendentes}</p>
              <p className="text-sm text-muted-foreground font-body">Pendentes</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border border-border/30 shadow-elevated rounded-2xl">
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-display font-bold text-success">{stats.aprovadas}</p>
              <p className="text-sm text-muted-foreground font-body">Aprovadas</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="border border-border/30 shadow-elevated rounded-2xl">
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-display font-bold text-info">{stats.abonoPecuniario}</p>
              <p className="text-sm text-muted-foreground font-body">Abono Pecuniário</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <DataTableToolbar
        filters={[{ key: 'status', label: 'Status', options: statusOptions, value: statusFilter, onChange: setStatusFilter }]}
      />

      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : !filtered?.length ? (
        <EmptyList entityName="solicitação de férias" />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border/30 overflow-hidden shadow-elevated">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-display font-semibold">Colaborador</TableHead>
                <TableHead className="font-display font-semibold">Período</TableHead>
                <TableHead className="font-display font-semibold">Dias</TableHead>
                <TableHead className="font-display font-semibold">Status</TableHead>
                <TableHead className="font-display font-semibold">Workflow</TableHead>
                <TableHead className="font-display font-semibold">Abono/13°</TableHead>
                <TableHead className="w-[160px] font-display font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s: Record<string, any>) => (
                <TableRow key={s.id} className="hover:bg-accent/30 transition-colors">
                  <TableCell className="font-body font-medium">{s.colaborador?.nome_completo || '-'}</TableCell>
                  <TableCell className="font-body text-sm">
                    {format(new Date(s.data_inicio), 'dd/MM/yyyy')} - {format(new Date(s.data_fim), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="font-body">{s.dias_gozo || '-'}</TableCell>
                  <TableCell>
                    {s.cancelado ? (
                      <Badge variant="destructive" className="text-xs">Cancelada</Badge>
                    ) : (
                      <StatusBadge status={s.status} />
                    )}
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <div className="flex gap-1.5">
                        {workflowSteps.map(({ key, label, icon: Icon }) => (
                          <Tooltip key={key}>
                            <TooltipTrigger>
                              <div className={`p-1 rounded-md ${s[key] ? 'bg-success/20 text-success' : 'bg-muted/50 text-muted-foreground'}`}>
                                <Icon className="h-3.5 w-3.5" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{label}: {s[key] ? '✅ Aprovado' : '⏳ Pendente'}</p>
                              {s[`${key}_em`] && <p className="text-xs">{format(new Date(s[`${key}_em`]), 'dd/MM/yyyy HH:mm')}</p>}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {s.abono_pecuniario && (
                        <Badge variant="outline" className="text-xs gap-1"><DollarSign className="h-3 w-3" />Abono</Badge>
                      )}
                      {s.adiantamento_13 && (
                        <Badge variant="outline" className="text-xs">13°</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {!s.cancelado && s.status !== 'rejeitada' && (
                      <div className="flex gap-1">
                        {!s.aprovado_gestor && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-success/10 text-success" onClick={() => aprovarGestor.mutate(s.id)} title="Aprovar (Gestor)">
                            <UserCheck className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {s.aprovado_gestor && !s.aprovado_rh && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-success/10 text-success" onClick={() => aprovarRH.mutate(s.id)} title="Aprovar (RH)">
                            <Shield className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {s.aprovado_rh && !s.enviado_contabilidade && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-info/10 text-info" onClick={() => enviarContabilidade.mutate(s.id)} title="Enviar Contabilidade">
                            <Building2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {!s.aprovado_gestor && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-destructive/10 text-destructive" onClick={() => rejeitarMutation.mutate(s.id)} title="Rejeitar">
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-destructive/10 text-destructive" onClick={() => cancelarMutation.mutate(s.id)} title="Cancelar">
                          <Ban className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </PageLayout>
  );
}
