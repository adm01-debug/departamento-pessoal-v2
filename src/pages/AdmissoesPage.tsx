import { useAdmissoes } from '@/hooks/useAdmissoes';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { EmptyList } from '@/components/ui/empty-state';
import { NovaAdmissaoDialog } from '@/components/admissoes/NovaAdmissaoDialog';
import { UserPlus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const etapaLabels: Record<string, string> = {
  documentos_pendentes: 'Docs Pendentes',
  aguardando_exame: 'Aguardando Exame',
  aguardando_aprovacao: 'Aguardando Aprovação',
  aprovada: 'Aprovada',
  contrato_gerado: 'Contrato Gerado',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
  esocial: 'eSocial',
};

const etapaGradients: Record<string, string> = {
  documentos_pendentes: 'bg-warning/15 text-warning border-0',
  aguardando_exame: 'bg-warning/15 text-warning border-0',
  aguardando_aprovacao: 'bg-info/15 text-info border-0',
  aprovada: 'bg-success/15 text-success border-0',
  concluida: 'bg-success/15 text-success border-0',
  cancelada: 'bg-destructive/15 text-destructive border-0',
  esocial: 'bg-primary/15 text-primary border-0',
};

export default function AdmissoesPage() {
  const { admissoes, isLoading } = useAdmissoes();

  return (
    <PageLayout
      title="Admissões"
      description="Gerencie o processo de admissão de colaboradores"
      icon={<UserPlus className="h-5 w-5 text-primary-foreground" />}
      gradient="from-success to-info"
      actions={
        <NovaAdmissaoDialog />
      }
    >
      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : admissoes.length === 0 ? (
        <EmptyList entityName="admissão" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {admissoes.map((admissao: any, i: number) => (
            <motion.div key={admissao.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="group border border-border/30 hover:border-border/60 shadow-elevated hover:shadow-glow transition-all duration-300 rounded-2xl overflow-hidden">
                <div className="h-[2px] bg-gradient-to-r from-success to-info opacity-60 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-display">{admissao.nome}</CardTitle>
                    <Badge className={etapaGradients[admissao.etapa] || 'bg-muted text-muted-foreground border-0'}>
                      {etapaLabels[admissao.etapa] || admissao.etapa}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1 font-body">
                  <p><strong className="text-foreground">Cargo:</strong> {admissao.cargo}</p>
                  <p><strong className="text-foreground">Departamento:</strong> {admissao.departamento}</p>
                  <p><strong className="text-foreground">Data prevista:</strong> {new Date(admissao.data_prevista).toLocaleDateString('pt-BR')}</p>
                  <p><strong className="text-foreground">Salário:</strong> {Number(admissao.salario_proposto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
