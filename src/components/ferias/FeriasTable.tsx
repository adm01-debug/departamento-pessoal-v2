import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { FeriasWorkflowStepper } from './FeriasWorkflowStepper';
import { FeriasActions } from './FeriasActions';

interface FeriasTableProps {
  data: Record<string, any>[];
  onAprovarGestor: (id: string) => void;
  onAprovarRH: (id: string) => void;
  onEnviarContabilidade: (id: string) => void;
  onRejeitar: (id: string) => void;
  onCancelar: (id: string) => void;
}

export function FeriasTable({ data, ...actions }: FeriasTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-border/30 overflow-hidden shadow-elevated"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="font-display font-semibold">Colaborador</TableHead>
            <TableHead className="font-display font-semibold">Período</TableHead>
            <TableHead className="font-display font-semibold text-center">Dias</TableHead>
            <TableHead className="font-display font-semibold">Status</TableHead>
            <TableHead className="font-display font-semibold">Workflow</TableHead>
            <TableHead className="font-display font-semibold">Abono/13°</TableHead>
            <TableHead className="w-[160px] font-display font-semibold text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((s, i) => (
            <motion.tr
              key={s.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="hover:bg-accent/30 transition-colors border-b border-border/20"
            >
              <TableCell className="font-body font-medium">{s.colaborador?.nome_completo || '-'}</TableCell>
              <TableCell className="font-body text-sm text-muted-foreground">
                {format(new Date(s.data_inicio), 'dd/MM/yyyy')} – {format(new Date(s.data_fim), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell className="text-center">
                <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-primary/10 text-primary font-display font-bold text-sm">
                  {s.dias_gozo || s.dias_ferias || '-'}
                </span>
              </TableCell>
              <TableCell>
                {s.cancelado ? (
                  <Badge variant="destructive" className="text-xs">Cancelada</Badge>
                ) : (
                  <StatusBadge status={s.status} />
                )}
              </TableCell>
              <TableCell>
                <FeriasWorkflowStepper solicitacao={s} />
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {s.abono_pecuniario && (
                    <Badge variant="outline" className="text-xs gap-1 border-border/30">
                      <DollarSign className="h-3 w-3" />Abono
                    </Badge>
                  )}
                  {s.adiantamento_13 && (
                    <Badge variant="outline" className="text-xs border-border/30">13°</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <FeriasActions solicitacao={s} {...actions} />
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
