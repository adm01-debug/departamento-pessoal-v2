/**
 * @fileoverview Card de ação com botão
 * @module components/cards/ActionCard
 */
import { memo } from 'react';
import { LucideIcon, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'destructive';
}

export const ActionCard = memo(function ActionCard({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onClick,
  variant = 'default'
}: ActionCardProps) {
  return (
    <Card className="hover:border-primary/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={cn("p-2 rounded-lg", variant === 'primary' ? 'bg-primary/10' : 'bg-muted')}>
            <Icon className={cn("h-5 w-5", variant === 'primary' ? 'text-primary' : 'text-muted-foreground')} />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
            <Button variant="ghost" size="sm" className="mt-2 -ml-2" onClick={onClick}>
              {actionLabel} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

