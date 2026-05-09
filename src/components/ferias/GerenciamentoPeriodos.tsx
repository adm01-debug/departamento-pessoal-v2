import { useQuery } from '@tanstack/react-query';
import { feriasService } from '@/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GerenciamentoPeriodosProps {
  colaboradorId: string;
}

export function GerenciamentoPeriodos({ colaboradorId }: GerenciamentoPeriodosProps) {
  const { data: periodos, isLoading } = useQuery({
    queryKey: ['periodos-aquisitivos', colaboradorId],
    queryFn: () => feriasService.listPeriodosAquisitivos(colaboradorId),
    enabled: !!colaboradorId,
  });

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
