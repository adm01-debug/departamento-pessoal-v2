import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
interface KpiCardProps { titulo: string; valor: string | number; icone?: React.ReactNode; variacao?: number; periodo?: string; }
export const KpiCard = memo(function KpiCard({ titulo, valor, icone, variacao, periodo }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{titulo}</CardTitle>
        {icone && <div className="p-2 rounded-lg bg-primary/10">{icone}</div>}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{valor}</p>
        {variacao !== undefined && (
          <p className={`text-xs flex items-center gap-1 mt-1 ${variacao >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {variacao >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{Math.abs(variacao)}%{periodo && <span className="text-muted-foreground ml-1">vs {periodo}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  );
});
