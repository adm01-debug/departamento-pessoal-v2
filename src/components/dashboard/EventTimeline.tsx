import { memo } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { UserPlus, UserMinus, Calendar, FileText, Clock, AlertTriangle, type LucideIcon } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'admissao' | 'demissao' | 'ferias' | 'folha' | 'ponto' | 'alerta';
}

const eventConfig: Record<string, { icon: LucideIcon; gradient: string }> = {
  admissao: { icon: UserPlus, gradient: 'from-success to-finance' },
  demissao: { icon: UserMinus, gradient: 'from-destructive to-streak' },
  ferias: { icon: Calendar, gradient: 'from-warning to-coins' },
  folha: { icon: FileText, gradient: 'from-info to-level' },
  ponto: { icon: Clock, gradient: 'from-primary to-primary-glow' },
  alerta: { icon: AlertTriangle, gradient: 'from-warning to-destructive' },
};

interface EventTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export const EventTimeline = memo(function EventTimeline({ events, className }: EventTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="p-3 rounded-2xl bg-muted/50 mb-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-caption text-muted-foreground font-body">Nenhum evento recente</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-0', className)}>
      {events.map((event, i) => {
        const config = eventConfig[event.type] || eventConfig.alerta;
        const Icon = config.icon;
        const isLast = i === events.length - 1;

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex gap-3 group"
          >
            {/* Timeline line + dot */}
            <div className="flex flex-col items-center shrink-0">
              <div className={cn('p-1.5 rounded-lg bg-gradient-to-br shadow-sm', config.gradient)}>
                <Icon className="h-3 w-3 text-primary-foreground" />
              </div>
              {!isLast && (
                <div className="w-px flex-1 bg-border/40 my-1" />
              )}
            </div>

            {/* Content */}
            <div className={cn('pb-4 min-w-0', isLast && 'pb-0')}>
              <p className="text-body font-body font-medium truncate leading-tight">{event.title}</p>
              <p className="text-caption text-muted-foreground font-body truncate">{event.description}</p>
              <p className="text-[10px] text-muted-foreground/60 font-body mt-0.5">{event.time}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});
