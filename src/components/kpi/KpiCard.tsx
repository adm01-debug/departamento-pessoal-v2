/**
 * @fileoverview Card de KPI
 * @module components/kpi/KpiCard
 */
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps { titulo: string; valor: string | number; icone?: React.ReactNode; trend?: { valor: number; tipo: 'up' | 'down' }; descricao?: string; }

export const KpiCard = memo(function KpiCard({ titulo, valor, icone, trend, descricao }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{titulo}</CardTitle>
        {icone && <div className="p-2 bg-primary/10 rounded-lg">{icone}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{valor}</div>
        {trend && (<div className={cn('flex items-center text-xs mt-1', trend.tipo === 'up' ? 'text-green-600' : 'text-red-600')}>{trend.tipo === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}{trend.valor}%</div>)}
        {descricao && <p className="text-xs text-muted-foreground mt-1">{descricao}</p>}
      </CardContent>
    </Card>
  );
});
