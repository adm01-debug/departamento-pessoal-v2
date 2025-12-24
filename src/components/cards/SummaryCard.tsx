/**
 * @fileoverview Card de resumo com múltiplos indicadores
 * @module components/cards/SummaryCard
 */
import { memo } from 'react';
import { LucideIcon, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface SummaryItem {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

interface SummaryCardProps {
  title: string;
  icon?: LucideIcon;
  items: SummaryItem[];
  showProgress?: boolean;
}

export const SummaryCard = memo(function SummaryCard({ title, icon: Icon = BarChart3, items, showProgress = true }: SummaryCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => {
          const percentage = item.max ? (item.value / item.max) * 100 : item.value;
          return (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium">{item.value}{item.max ? `/${item.max}` : '%'}</span>
              </div>
              {showProgress && (
                <Progress value={Math.min(100, percentage)} className="h-2" style={{ '--progress-color': item.color } as React.CSSProperties} />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
});

