import { useAfastamentos } from '@/hooks/useAfastamentos';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { EmptyList } from '@/components/ui/empty-state';
import { Heart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const statusColors: Record<string, string> = {
  ativo: 'bg-warning/15 text-warning border-0',
  finalizado: 'bg-success/15 text-success border-0',
  cancelado: 'bg-destructive/15 text-destructive border-0',
};

export default function AfastamentosPage() {
  const { afastamentos, isLoading } = useAfastamentos();

  return (
    <PageLayout
      title="Afastamentos"
      description="Controle de afastamentos dos colaboradores"
      icon={<Heart className="h-5 w-5 text-primary-foreground" />}
      gradient="from-destructive to-warning"
      actions={
        <Button className="rounded-xl bg-gradient-to-r from-destructive to-warning hover:opacity-90 shadow-lg font-body">
          <Plus className="h-4 w-4 mr-2" />Novo Afastamento
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : afastamentos.length === 0 ? (
        <EmptyList entityName="afastamento" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {afastamentos.map((a: any, i: number) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="group border border-border/30 hover:border-border/60 shadow-elevated hover:shadow-glow transition-all duration-300 rounded-2xl overflow-hidden">
                <div className="h-[2px] bg-gradient-to-r from-destructive to-warning opacity-60 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-display">{a.colaborador?.nome_completo || 'Colaborador'}</CardTitle>
                    <Badge className={statusColors[a.status] || 'bg-muted text-muted-foreground border-0'}>{a.status || a.tipo}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1 font-body">
                  <p><strong className="text-foreground">Tipo:</strong> {a.tipo}</p>
                  <p><strong className="text-foreground">Início:</strong> {new Date(a.data_inicio).toLocaleDateString('pt-BR')}</p>
                  <p><strong className="text-foreground">Previsão fim:</strong> {new Date(a.data_fim_prevista).toLocaleDateString('pt-BR')}</p>
                  {a.cid && <p><strong className="text-foreground">CID:</strong> {a.cid} {a.cid_descricao && `- ${a.cid_descricao}`}</p>}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
