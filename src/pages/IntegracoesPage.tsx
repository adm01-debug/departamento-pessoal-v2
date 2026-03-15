import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plug, ExternalLink, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Integracao {
  id: string;
  nome: string;
  descricao: string;
  status: 'ativo' | 'inativo' | 'configurando';
  gradient: string;
  icon: string;
}

const integracoes: Integracao[] = [
  { id: 'bitrix', nome: 'Bitrix24', descricao: 'Sincronização de colaboradores, cargos e departamentos com o CRM', status: 'inativo', gradient: 'from-info to-level', icon: '🔗' },
  { id: 'contabilidade', nome: 'Contabilidade', descricao: 'Exportação de dados contábeis (SPED, DIRF, RAIS)', status: 'inativo', gradient: 'from-finance to-success', icon: '📊' },
  { id: 'esocial', nome: 'eSocial', descricao: 'Transmissão automática de eventos trabalhistas', status: 'ativo', gradient: 'from-success to-finance', icon: '🏛️' },
  { id: 'banco', nome: 'Bancos (CNAB)', descricao: 'Geração de arquivos bancários para folha de pagamento', status: 'inativo', gradient: 'from-warning to-coins', icon: '🏦' },
  { id: 'ponto', nome: 'Relógio de Ponto', descricao: 'Integração com REPs homologados', status: 'inativo', gradient: 'from-streak to-warning', icon: '⏰' },
  { id: 'webhook', nome: 'Webhooks', descricao: 'Notificações HTTP para sistemas externos', status: 'inativo', gradient: 'from-xp to-tasks', icon: '🔔' },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  ativo: { label: 'Ativo', color: 'bg-success/10 text-success', icon: CheckCircle },
  inativo: { label: 'Inativo', color: 'bg-muted text-muted-foreground', icon: XCircle },
  configurando: { label: 'Configurando', color: 'bg-warning/10 text-warning', icon: RefreshCw },
};

export default function IntegracoesPage() {
  return (
    <PageLayout title="Integrações" description="Conecte o sistema a serviços externos" icon={<Plug className="h-5 w-5 text-white" />} gradient="from-xp to-tasks">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integracoes.map((integ, i) => {
          const statusInfo = statusConfig[integ.status];
          const StatusIcon = statusInfo.icon;
          return (
            <motion.div key={integ.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="group border border-border/30 rounded-2xl hover:shadow-elevated hover:border-border/60 transition-all overflow-hidden relative">
                <div className={cn('absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r', integ.gradient)} />
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{integ.icon}</span>
                      <CardTitle className="font-display text-base">{integ.nome}</CardTitle>
                    </div>
                    <Badge variant="outline" className={cn('text-[10px] gap-1', statusInfo.color)}>
                      <StatusIcon className="h-3 w-3" />{statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground font-body mb-4">{integ.descricao}</p>
                  <Button variant="outline" size="sm" className="w-full rounded-xl font-body gap-2 group-hover:border-primary/30">
                    <ExternalLink className="h-3.5 w-3.5" />Configurar
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </PageLayout>
  );
}
