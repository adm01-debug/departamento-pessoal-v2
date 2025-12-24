/**
 * @fileoverview Card de informação genérico
 * @module components/cards/InfoCard
 */
import { memo } from 'react';
import { LucideIcon, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface InfoItem {
  label: string;
  value: string | number;
}

interface InfoCardProps {
  title: string;
  icon?: LucideIcon;
  items: InfoItem[];
  className?: string;
}

export const InfoCard = memo(function InfoCard({ title, icon: Icon = Info, items, className }: InfoCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <dt className="text-sm text-muted-foreground">{item.label}</dt>
              <dd className="text-sm font-medium">{item.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
});

