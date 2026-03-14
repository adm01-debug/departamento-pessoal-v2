import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { FileCheck, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const eventos = [
  { codigo: 'S-1000', nome: 'Informações do Empregador', status: 'enviado', data: '10/01/2025' },
  { codigo: 'S-1005', nome: 'Tabela de Estabelecimentos', status: 'enviado', data: '10/01/2025' },
  { codigo: 'S-1010', nome: 'Tabela de Rubricas', status: 'pendente', data: '-' },
  { codigo: 'S-1200', nome: 'Remuneração de Trabalhador', status: 'erro', data: '08/01/2025' },
  { codigo: 'S-2200', nome: 'Cadastramento Inicial', status: 'enviado', data: '05/01/2025' },
];

const statsData = [
  { label: 'Eventos Enviados', value: '15', gradient: 'from-success to-finance' },
  { label: 'Pendentes', value: '3', gradient: 'from-warning to-coins' },
  { label: 'Com Erro', value: '1', gradient: 'from-destructive to-streak' },
  { label: 'Conformidade', value: '98%', gradient: 'from-info to-level' },
];

export default function ESocialPage() {
  const statusVariant = (s: string) => s === 'enviado' ? 'success' : s === 'erro' ? 'error' : 'warning';

  const statusIcon = (s: string) => {
    if (s === 'enviado') return <CheckCircle className="h-5 w-5 text-success" />;
    if (s === 'erro') return <AlertCircle className="h-5 w-5 text-destructive" />;
    return <Send className="h-5 w-5 text-warning" />;
  };

  return (
    <PageLayout
      title="eSocial"
      description="Gestão de eventos eSocial"
      icon={<FileCheck className="h-5 w-5 text-white" />}
      gradient="from-success to-finance"
    >
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {statsData.map(({ label, value, gradient }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden group hover:shadow-glow transition-all">
              <div className={cn("h-[2px] bg-gradient-to-r", gradient)} />
              <CardContent className="pt-6">
                <div className="text-3xl font-display font-bold">{value}</div>
                <p className="text-xs text-muted-foreground font-body mt-1">{label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Events */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
          <div className="h-[2px] bg-gradient-to-r from-success to-finance" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5 font-display">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-success to-finance">
                <FileCheck className="h-4 w-4 text-white" />
              </div>
              Eventos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {eventos.map((e, i) => (
                <motion.div
                  key={e.codigo}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  className="flex items-center justify-between p-3.5 rounded-xl glass hover:border-border/60 transition-all"
                >
                  <div className="flex items-center gap-4">
                    {statusIcon(e.status)}
                    <div>
                      <p className="font-body font-medium">{e.codigo} - {e.nome}</p>
                      <p className="text-sm text-muted-foreground font-body">{e.data}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={e.status} variant={statusVariant(e.status) as any} />
                    {e.status === 'pendente' && (
                      <Button size="sm" className="rounded-xl bg-gradient-to-r from-warning to-coins hover:opacity-90 text-white font-body">Enviar</Button>
                    )}
                    {e.status === 'erro' && (
                      <Button size="sm" className="rounded-xl bg-gradient-to-r from-destructive to-streak hover:opacity-90 text-white font-body">Reenviar</Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </PageLayout>
  );
}
