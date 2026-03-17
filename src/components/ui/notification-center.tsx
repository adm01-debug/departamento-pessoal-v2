import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Calendar, UserPlus, AlertTriangle, CheckCircle2,
  Clock, FileText, X, Check,
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'action';
  read: boolean;
  icon: React.ElementType;
  gradient: string;
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'Férias pendentes de aprovação', description: '3 solicitações aguardam revisão', time: '5min', type: 'action', read: false, icon: Calendar, gradient: 'from-primary-glow to-primary' },
  { id: '2', title: 'Nova admissão registrada', description: 'João Silva - Desenvolvedor', time: '1h', type: 'success', read: false, icon: UserPlus, gradient: 'from-primary to-primary-glow' },
  { id: '3', title: 'Documentos vencidos', description: '2 ASOs precisam renovação', time: '2h', type: 'warning', read: false, icon: AlertTriangle, gradient: 'from-destructive to-streak' },
  { id: '4', title: 'Folha processada', description: 'Competência 03/2026 finalizada', time: '1d', type: 'info', read: true, icon: FileText, gradient: 'from-primary to-primary-glow' },
  { id: '5', title: 'Ponto ajustado', description: 'Ajuste aprovado para Maria Santos', time: '2d', type: 'success', read: true, icon: Clock, gradient: 'from-primary to-primary-glow' },
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-accent/50 rounded-xl">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-destructive text-destructive-foreground rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-card"
            >
              {unreadCount}
            </motion.span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[380px] p-0 glass border-border/50 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-semibold text-sm">Notificações</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                {unreadCount} novas
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs h-7 gap-1 text-muted-foreground hover:text-foreground">
              <Check className="h-3 w-3" />
              Marcar todas
            </Button>
          )}
        </div>

        {/* List */}
        <div className="max-h-[400px] overflow-y-auto no-scrollbar">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-3 rounded-2xl bg-success/10 mb-3">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <p className="text-sm font-display font-semibold">Tudo em dia!</p>
                <p className="text-xs text-muted-foreground font-body mt-1">Sem novas notificações</p>
              </div>
            ) : (
              notifications.map((notif, i) => {
                const Icon = notif.icon;
                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10, height: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => markRead(notif.id)}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors group border-b border-border/20 last:border-0',
                      !notif.read ? 'bg-primary/[0.03]' : 'hover:bg-accent/30'
                    )}
                  >
                    <div className={cn('p-2 rounded-xl bg-gradient-to-br shrink-0 mt-0.5', notif.gradient)}>
                      <Icon className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn('text-sm font-body truncate', !notif.read ? 'font-semibold' : 'font-medium')}>
                          {notif.title}
                        </p>
                        {!notif.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground font-body mt-0.5 truncate">{notif.description}</p>
                      <p className="text-[11px] text-muted-foreground/60 font-body mt-1">{notif.time} atrás</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </PopoverContent>
    </Popover>
  );
}
