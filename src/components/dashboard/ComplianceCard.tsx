/**
 * @fileoverview Card de compliance e conformidade legal
 * @module components/dashboard/ComplianceCard
 */
import { memo } from 'react';
import { Shield, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ComplianceItem {
  id: string;
  nome: string;
  status: 'ok' | 'pendente' | 'vencido';
  percentual: number;
}

interface ComplianceCardProps {
  /** Lista de itens de compliance */
  itens: ComplianceItem[];
  /** Percentual geral de conformidade */
  percentualGeral: number;
}

const statusConfig = {
  ok: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500' },
  pendente: { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-500' },
  vencido: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500' },
};

/**
 * Card que exibe status de compliance da empresa
 * @param props - Propriedades do componente
 * @returns Card com indicadores de conformidade
 */
export const ComplianceCard = memo(function ComplianceCard({ itens, percentualGeral }: ComplianceCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-500" />
          Compliance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <span className="text-3xl font-bold">{percentualGeral}%</span>
          <p className="text-xs text-muted-foreground">Conformidade Geral</p>
          <Progress value={percentualGeral} className="mt-2" />
        </div>
        <div className="space-y-2">
          {itens.map((item) => {
            const config = statusConfig[item.status];
            const Icon = config.icon;
            return (
              <div key={item.id} className="flex items-center justify-between">
                <span className="text-sm">{item.nome}</span>
                <Icon className={`h-4 w-4 ${config.color}`} />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});

