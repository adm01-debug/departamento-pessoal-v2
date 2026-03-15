import { useDesligamentos } from '@/hooks/useDesligamentos';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { EmptyList } from '@/components/ui/empty-state';
import { UserMinus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function DesligamentosPage() {
  const { desligamentos, isLoading } = useDesligamentos();

  return (
    <PageLayout
      title="Desligamentos"
      description="Controle de desligamentos e rescisões"
      icon={<UserMinus className="h-5 w-5 text-primary-foreground" />}
      gradient="from-destructive to-destructive/70"
      actions={
        <Button className="rounded-xl bg-gradient-to-r from-destructive to-destructive/70 hover:opacity-90 shadow-lg font-body">
          <Plus className="h-4 w-4 mr-2" />Novo Desligamento
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : desligamentos.length === 0 ? (
        <EmptyList entityName="desligamento" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {desligamentos.map((d: any, i: number) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="group border border-border/30 hover:border-border/60 shadow-elevated hover:shadow-glow transition-all duration-300 rounded-2xl overflow-hidden">
                <div className="h-[2px] bg-gradient-to-r from-destructive to-destructive/70 opacity-60 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-display">{d.colaborador?.nome_completo || 'Colaborador'}</CardTitle>
                    <Badge className="bg-destructive/15 text-destructive border-0">{d.tipo_rescisao || 'Desligamento'}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1 font-body">
                  <p><strong className="text-foreground">Data:</strong> {d.data_desligamento ? new Date(d.data_desligamento).toLocaleDateString('pt-BR') : '-'}</p>
                  <p><strong className="text-foreground">Status:</strong> {d.status || '-'}</p>
                  {d.motivo && <p><strong className="text-foreground">Motivo:</strong> {d.motivo}</p>}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
