/**
 * @fileoverview Card de dados genérico
 * @module components/data/DataCard
 */
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DataCardProps { titulo: string; valor: string | number; icone?: React.ReactNode; descricao?: string; trend?: { valor: number; tipo: 'up' | 'down' }; className?: string; }

export const DataCard = memo(function DataCard({ titulo, valor, icone, descricao, trend, className }: DataCardProps) {
  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{titulo}</CardTitle>
        {icone && <div className="p-2 rounded-lg bg-primary/10">{icone}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold">{valor}</p>
          {trend && <span className={cn('text-xs font-medium', trend.tipo === 'up' ? 'text-green-600' : 'text-red-600')}>{trend.tipo === 'up' ? '↑' : '↓'} {trend.valor}%</span>}
        </div>
        {descricao && <p className="text-xs text-muted-foreground mt-1">{descricao}</p>}
      </CardContent>
    </Card>
  );
});
