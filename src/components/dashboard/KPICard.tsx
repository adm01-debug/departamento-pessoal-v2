import { memo, useMemo } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; positive: boolean };
  colorClass?: string;
  onClick?: () => void;
}

export const KPICard = memo(function KPICard({ icon: Icon, label, value, subtitle, trend, colorClass = 'text-primary', onClick }: KPICardProps) {
  return (
    <div 
      className={cn(
        "p-4 rounded-xl bg-card border border-border hover-lift cursor-pointer group",
        onClick && "hover:border-primary/30"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={cn("p-2.5 rounded-lg bg-muted/50 group-hover:scale-105 transition-transform", colorClass)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold font-display text-foreground mt-0.5">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
          {trend && (
            <p className={cn(
              "text-xs mt-1 font-medium",
              trend.positive ? "text-success" : "text-destructive"
            )}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% vs mês ant.
            </p>
          )}
        </div>
      </div>
    </div>
  );
});