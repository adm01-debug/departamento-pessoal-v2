import { memo } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AlertTriangle, Calendar, FileText, Stethoscope, type LucideIcon } from 'lucide-react';

export interface ExpiringItem {
  id: string;
  label: string;
  detail: string;
  daysLeft: number;
  type: 'aso' | 'documento' | 'contrato' | 'ferias';
}

const typeConfig: Record<string, { icon: LucideIcon; gradient: string }> = {
  aso: { icon: Stethoscope, gradient: 'from-destructive to-streak' },
  documento: { icon: FileText, gradient: 'from-warning to-coins' },
  contrato: { icon: Calendar, gradient: 'from-info to-level' },
  ferias: { icon: Calendar, gradient: 'from-xp to-tasks' },
};

function getUrgencyClass(daysLeft: number) {
  if (daysLeft <= 7) return 'bg-destructive/15 text-destructive border-destructive/30';
  if (daysLeft <= 30) return 'bg-warning/15 text-warning border-warning/30';
  return 'bg-info/15 text-info border-info/30';
}

function getUrgencyLabel(daysLeft: number) {
  if (daysLeft <= 0) return 'Vencido';
  if (daysLeft === 1) return '1 dia';
  return `${daysLeft} dias`;
}

interface ExpiringItemsWidgetProps {
  items: ExpiringItem[];
  className?: string;
}

export const ExpiringItemsWidget = memo(function ExpiringItemsWidget({ items, className }: ExpiringItemsWidgetProps) {
  const sorted = [...items].sort((a, b) => a.daysLeft - b.daysLeft);

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="p-3 rounded-2xl bg-success/10 mb-2">
          <Calendar className="h-5 w-5 text-success" />
        </div>
        <p className="text-caption text-muted-foreground font-body">Nada vencendo em breve</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {sorted.slice(0, 5).map((item, i) => {
        const config = typeConfig[item.type] || typeConfig.documento;
        const Icon = config.icon;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/30 transition-colors group cursor-pointer"
          >
            <div className={cn('p-2 rounded-lg bg-gradient-to-br shrink-0', config.gradient)}>
              <Icon className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body font-body font-medium truncate">{item.label}</p>
              <p className="text-[11px] text-muted-foreground font-body truncate">{item.detail}</p>
            </div>
            <span className={cn(
              'text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0',
              getUrgencyClass(item.daysLeft)
            )}>
              {getUrgencyLabel(item.daysLeft)}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
});
