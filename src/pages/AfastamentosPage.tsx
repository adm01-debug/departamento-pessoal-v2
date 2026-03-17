import { useState } from 'react';
import { useAfastamentos } from '@/hooks/useAfastamentos';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { EmptyList } from '@/components/ui/empty-state';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Plus, Calendar, Clock, AlertTriangle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const statusColors: Record<string, string> = {
  ativo: 'bg-warning/15 text-warning border-0',
  aprovado: 'bg-success/15 text-success border-0',
  finalizado: 'bg-success/15 text-success border-0',
  pendente: 'bg-info/15 text-info border-0',
  cancelado: 'bg-destructive/15 text-destructive border-0',
  rejeitado: 'bg-destructive/15 text-destructive border-0',
};

const tipoLabels: Record<string, string> = {
  doenca: 'Doença', acidente_trabalho: 'Acidente Trabalho', maternidade: 'Maternidade',
  paternidade: 'Paternidade', auxilio_doenca: 'Auxílio Doença', outros: 'Outros',
};

export default function AfastamentosPage() {
  const { afastamentos, isLoading } = useAfastamentos();
  const [tab, setTab] = useState('todos');

  const filtered = tab === 'todos' ? afastamentos : afastamentos.filter((a: any) => a.status === tab);

  const stats = {
    total: afastamentos.length,
    ativos: afastamentos.filter((a: any) => a.status === 'ativo').length,
    pendentes: afastamentos.filter((a: any) => a.status === 'pendente').length,
    finalizados: afastamentos.filter((a: any) => a.status === 'finalizado').length,
    diasTotais: afastamentos.reduce((sum: number, a: any) => sum + (a.dias_total || 0), 0),
  };

  return (
    <PageLayout
      title="Afastamentos"
      description="Controle completo de afastamentos, licenças e auxílios"
      icon={<Heart className="h-5 w-5 text-primary-foreground" />}
      gradient="from-destructive to-warning"
      actions={
        <Button className="rounded-xl bg-gradient-to-r from-destructive to-warning hover:opacity-90 shadow-lg font-body">
          <Plus className="h-4 w-4 mr-2" />Novo Afastamento
        </Button>
      }
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, icon: Activity, color: 'text-foreground' },
          { label: 'Ativos', value: stats.ativos, icon: AlertTriangle, color: 'text-warning' },
          { label: 'Pendentes', value: stats.pendentes, icon: Clock, color: 'text-info' },
          { label: 'Finalizados', value: stats.finalizados, icon: Heart, color: 'text-success' },
          { label: 'Dias Totais', value: stats.diasTotais, icon: Calendar, color: 'text-destructive' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border border-border/30 shadow-elevated rounded-2xl">
              <CardContent className="pt-4 text-center">
                <kpi.icon className={`h-5 w-5 mx-auto mb-1 ${kpi.color}`} />
                <p className={`text-2xl font-display font-bold ${kpi.color}`}>{kpi.value}</p>
                <p className="text-xs text-muted-foreground font-body">{kpi.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Table with filters */}
      <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
        <div className="h-[2px] bg-gradient-to-r from-destructive to-warning" />
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <CardTitle className="font-display">Registros de Afastamento</CardTitle>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="h-8">
                <TabsTrigger value="todos" className="text-xs px-2 h-6">Todos</TabsTrigger>
                <TabsTrigger value="ativo" className="text-xs px-2 h-6">Ativos</TabsTrigger>
                <TabsTrigger value="pendente" className="text-xs px-2 h-6">Pendentes</TabsTrigger>
                <TabsTrigger value="finalizado" className="text-xs px-2 h-6">Finalizados</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Spinner size="lg" /></div>
          ) : filtered.length === 0 ? (
            <EmptyList entityName="afastamento" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-display font-semibold">Colaborador</TableHead>
                  <TableHead className="font-display font-semibold">Tipo</TableHead>
                  <TableHead className="font-display font-semibold">Início</TableHead>
                  <TableHead className="font-display font-semibold">Fim Previsto</TableHead>
                  <TableHead className="font-display font-semibold">Dias</TableHead>
                  <TableHead className="font-display font-semibold">CID</TableHead>
                  <TableHead className="font-display font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a: any) => (
                  <TableRow key={a.id} className="hover:bg-accent/30 transition-colors">
                    <TableCell className="font-body font-medium">{a.colaborador?.nome_completo || '—'}</TableCell>
                    <TableCell className="font-body text-sm">
                      <Badge variant="outline" className="text-xs">{tipoLabels[a.tipo] || a.tipo}</Badge>
                    </TableCell>
                    <TableCell className="font-body text-sm">{new Date(a.data_inicio).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="font-body text-sm">{new Date(a.data_fim_prevista).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="font-body text-sm font-medium">{a.dias_total || '—'}</TableCell>
                    <TableCell className="font-body text-sm">{a.cid || '—'}</TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${statusColors[a.status] || 'bg-muted text-muted-foreground border-0'}`}>
                        {a.status || '—'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
}
