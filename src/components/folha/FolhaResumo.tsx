/**
 * @fileoverview Resumo da folha de pagamento com totalizadores
 * @module components/folha/FolhaResumo
 */
import { memo } from 'react';
import { DollarSign, Users, TrendingUp, TrendingDown, Calendar, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface FolhaResumoProps {
  competencia: string;
  totalBruto: number;
  totalDescontos: number;
  totalLiquido: number;
  totalColaboradores: number;
  totalHorasExtras?: number;
  totalBeneficios?: number;
  status: 'em_processamento' | 'processada' | 'fechada';
  percentualProcessado?: number;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  em_processamento: { label: 'Em Processamento', variant: 'outline' },
  processada: { label: 'Processada', variant: 'default' },
  fechada: { label: 'Fechada', variant: 'secondary' },
};

/**
 * Resumo da folha de pagamento
 * @param props - Propriedades do resumo
 * @returns Elemento React
 */
export const FolhaResumo = memo(function FolhaResumo({
  competencia,
  totalBruto,
  totalDescontos,
  totalLiquido,
  totalColaboradores,
  totalHorasExtras = 0,
  totalBeneficios = 0,
  status,
  percentualProcessado = 100,
}: FolhaResumoProps) {
  const statusInfo = statusConfig[status];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle>Folha {competencia}</CardTitle>
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'em_processamento' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progresso</span>
              <span>{percentualProcessado}%</span>
            </div>
            <Progress value={percentualProcessado} />
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Total Bruto
            </div>
            <p className="text-lg font-semibold text-green-600">{formatCurrency(totalBruto)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Descontos
            </div>
            <p className="text-lg font-semibold text-red-600">{formatCurrency(totalDescontos)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4 text-primary" />
              Total Líquido
            </div>
            <p className="text-lg font-semibold">{formatCurrency(totalLiquido)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              Colaboradores
            </div>
            <p className="text-lg font-semibold">{totalColaboradores}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Horas Extras</span>
            <span className="font-medium">{formatCurrency(totalHorasExtras)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Benefícios</span>
            <span className="font-medium">{formatCurrency(totalBeneficios)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
