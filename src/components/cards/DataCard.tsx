/**
 * @fileoverview Card de dados com valor e tendência
 * @module components/cards/DataCard
 */
import { memo } from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DataCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  iconColor?: string;
}

export const DataCard = memo(function DataCard({ 
  icon: Icon, 
  label, 
  value, 
  change,
  changeLabel,
  iconColor = 'text-primary'
}: DataCardProps) {
  const isPositive = change && change > 0;
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Icon className={cn("h-5 w-5", iconColor)} />
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 text-xs", isPositive ? 'text-green-500' : 'text-red-500')}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
          {changeLabel && <p className="text-xs text-muted-foreground mt-1">{changeLabel}</p>}
        </div>
      </CardContent>
    </Card>
  );
});

