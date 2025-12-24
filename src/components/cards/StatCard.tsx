/**
 * @fileoverview Card de estatística com ícone e tendência
 * @module components/cards/StatCard
 */
import { memo } from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: { value: number; positive: boolean };
  subtitle?: string;
  colorClass?: string;
  onClick?: () => void;
}

export const StatCard = memo(function StatCard({ icon: Icon, label, value, trend, subtitle, colorClass = 'text-primary', onClick }: StatCardProps) {
  const TrendIcon = trend ? (trend.positive ? TrendingUp : TrendingDown) : Minus;
  
  return (
    <Card className={cn("hover-lift cursor-pointer group", onClick && "hover:border-primary/30")} onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Icon className={cn("h-5 w-5", colorClass)} />
          {trend && (
            <div className={cn("flex items-center gap-1 text-xs", trend.positive ? 'text-green-500' : 'text-red-500')}>
              <TrendIcon className="h-3 w-3" />
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
});

