import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feriasService, colaboradorService } from '@/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, AlertTriangle, CheckCircle2, Clock, Plus, Trash2, Edit2, Loader2, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useEmpresas } from '@/hooks/useEmpresas';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GerenciamentoPeriodosProps {
  colaboradorId?: string;
}

export function GerenciamentoPeriodos({ colaboradorId: initialColaboradorId }: GerenciamentoPeriodosProps) {
  const { empresaAtual } = useEmpresas();
  const qc = useQueryClient();
  const [selectedColabId, setSelectedColabId] = useState(initialColaboradorId || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPeriodo, setEditingPeriodo] = useState<any>(null);
  const [form, setForm] = useState({
    data_inicio: '',
    data_fim: '',
    dias_direito: '30',
    status: 'aberto',
    numero_periodo: '1'
  });

  const { data: colaboradores } = useQuery({
    queryKey: ['colaboradores-ferias', empresaAtual?.id],
    queryFn: () => colaboradorService.list(empresaAtual?.id),
    enabled: !!empresaAtual?.id,
  });

  const { data: periodos, isLoading } = useQuery({
    queryKey: ['periodos-aquisitivos', selectedColabId],
    queryFn: () => feriasService.listPeriodosAquisitivos(selectedColabId),
    enabled: !!selectedColabId,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => feriasService.criarPeriodoAquisitivo(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['periodos-aquisitivos', selectedColabId] });
      toast.success('Período aquisitivo criado');
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => feriasService.atualizarPeriodoAquisitivo(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['periodos-aquisitivos', selectedColabId] });
      toast.success('Período aquisitivo atualizado');
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => feriasService.excluirPeriodoAquisitivo(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['periodos-aquisitivos', selectedColabId] });
      toast.success('Período aquisitivo excluído');
    },
  });

  const handleSave = () => {
    const data = {
      ...form,
      colaborador_id: selectedColabId,
      dias_direito: parseInt(form.dias_direito),
      numero_periodo: parseInt(form.numero_periodo),
    };

    if (editingPeriodo) {
      updateMutation.mutate({ id: editingPeriodo.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openCreate = () => {
    setEditingPeriodo(null);
    setForm({
      data_inicio: '',
      data_fim: '',
      dias_direito: '30',
      status: 'aberto',
      numero_periodo: ((periodos?.length || 0) + 1).toString()
    });
    setIsDialogOpen(true);
  };

  const openEdit = (p: any) => {
    setEditingPeriodo(p);
    setForm({
      data_inicio: p.data_inicio,
      data_fim: p.data_fim,
      dias_direito: p.dias_direito.toString(),
      status: p.status,
      numero_periodo: p.numero_periodo.toString()
    });
    setIsDialogOpen(true);
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aberto':
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />Aberto</Badge>;
      case 'vencido':
        return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" />Vencido</Badge>;
      case 'concluido':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600 gap-1"><CheckCircle2 className="h-3 w-3" />Concluído</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) return <div>Carregando períodos...</div>;

  return (
    <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Períodos Aquisitivos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/40">
              <TableHead className="font-display">Período</TableHead>
              <TableHead className="font-display">Início</TableHead>
              <TableHead className="font-display">Fim</TableHead>
              <TableHead className="font-display">Direito</TableHead>
              <TableHead className="font-display">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!periodos?.length ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-body">
                  Nenhum período aquisitivo encontrado.
                </TableCell>
              </TableRow>
            ) : (
              periodos.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/20 border-border/40 transition-colors">
                  <TableCell className="font-body font-medium">#{p.numero_periodo}</TableCell>
                  <TableCell className="font-body">{format(new Date(p.data_inicio), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                  <TableCell className="font-body">{format(new Date(p.data_fim), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                  <TableCell className="font-body">{p.dias_direito} dias</TableCell>
                  <TableCell>{getStatusBadge(p.status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
