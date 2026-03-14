import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Users, Building2, FileText, Calendar,
  Clock, Gift, BarChart3, Settings, FileCheck,
  Zap, ChevronDown,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState } from 'react';

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

interface MenuItem {
  path: string;
  label: string;
  icon: React.ElementType;
  color: string;
  badge?: number;
}

const menuGroups: MenuGroup[] = [
  {
    label: 'Principal',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: Home, color: 'from-primary to-primary-glow' },
      { path: '/colaboradores', label: 'Colaboradores', icon: Users, color: 'from-info to-level' },
      { path: '/empresas', label: 'Empresas', icon: Building2, color: 'from-xp to-tasks' },
    ],
  },
  {
    label: 'Operações',
    items: [
      { path: '/folha', label: 'Folha', icon: FileText, color: 'from-finance to-success' },
      { path: '/ferias', label: 'Férias', icon: Calendar, color: 'from-warning to-coins', badge: 0 },
      { path: '/ponto', label: 'Ponto', icon: Clock, color: 'from-streak to-warning' },
    ],
  },
  {
    label: 'Gestão',
    items: [
      { path: '/beneficios', label: 'Benefícios', icon: Gift, color: 'from-xp to-store' },
      { path: '/relatorios', label: 'Relatórios', icon: BarChart3, color: 'from-info to-primary' },
      { path: '/esocial', label: 'eSocial', icon: FileCheck, color: 'from-success to-finance' },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { path: '/configuracoes', label: 'Configurações', icon: Settings, color: 'from-muted-foreground to-foreground' },
    ],
  },
];

interface SidebarProps {
  collapsed?: boolean;
  className?: string;
  pendingCounts?: Record<string, number>;
}

export function Sidebar({ collapsed = false, className, pendingCounts }: SidebarProps) {
  const location = useLocation();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    if (collapsed) return;
    setCollapsedGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  // Merge pending counts into badges
  const getBadge = (path: string): number | undefined => {
    if (pendingCounts) return pendingCounts[path];
    return undefined;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'flex flex-col h-full border-r border-border/50',
          'bg-gradient-to-b from-card via-card to-card/80',
          'backdrop-blur-xl transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          className
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-glow">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success animate-pulse-glow" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Dept. Pessoal
                </h1>
                <p className="text-overline text-muted-foreground">
                  Sistema DP
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
          {menuGroups.map((group, gi) => {
            const isGroupCollapsed = collapsedGroups[group.label];

            return (
              <div key={group.label} className={cn(gi > 0 && 'mt-2')}>
                {/* Group header */}
                {!collapsed ? (
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className="w-full flex items-center justify-between px-3 py-1.5 mb-1 group/header"
                  >
                    <span className="text-overline text-muted-foreground/60 group-hover/header:text-muted-foreground transition-colors">
                      {group.label}
                    </span>
                    <ChevronDown className={cn(
                      'h-3 w-3 text-muted-foreground/40 transition-transform duration-200',
                      isGroupCollapsed && '-rotate-90'
                    )} />
                  </button>
                ) : (
                  gi > 0 && <div className="h-px bg-border/30 mx-2 my-2" />
                )}

                {/* Group items */}
                <AnimatePresence initial={false}>
                  {!isGroupCollapsed && (
                    <motion.div
                      initial={false}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-0.5 overflow-hidden"
                    >
                      {group.items.map(({ path, label, icon: Icon, color }) => {
                        const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
                        const badge = getBadge(path);

                        const linkContent = (
                          <Link
                            key={path}
                            to={path}
                            className={cn(
                              'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 font-body text-sm',
                              isActive
                                ? 'text-primary-foreground shadow-elevated'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                              collapsed && 'justify-center px-0'
                            )}
                          >
                            {/* Active background gradient */}
                            {isActive && (
                              <div className={cn(
                                'absolute inset-0 rounded-xl bg-gradient-to-r opacity-90',
                                color
                              )} />
                            )}

                            {/* Icon */}
                            <div className={cn(
                              'relative z-10 flex items-center justify-center',
                              isActive ? '' : 'group-hover:scale-110 transition-transform duration-200'
                            )}>
                              <Icon className="h-[18px] w-[18px]" />
                            </div>

                            {/* Label */}
                            {!collapsed && (
                              <span className="relative z-10 font-medium flex-1">
                                {label}
                              </span>
                            )}

                            {/* Badge */}
                            {!collapsed && badge !== undefined && badge > 0 && (
                              <span className="relative z-10 min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                                {badge > 99 ? '99+' : badge}
                              </span>
                            )}

                            {/* Collapsed badge dot */}
                            {collapsed && badge !== undefined && badge > 0 && (
                              <div className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive z-10" />
                            )}

                            {/* Hover glow effect */}
                            {!isActive && (
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300" />
                            )}
                          </Link>
                        );

                        if (collapsed) {
                          return (
                            <Tooltip key={path}>
                              <TooltipTrigger asChild>
                                {linkContent}
                              </TooltipTrigger>
                              <TooltipContent side="right" className="font-body">
                                <p>{label}</p>
                                {badge !== undefined && badge > 0 && (
                                  <p className="text-caption text-muted-foreground">{badge} pendente{badge > 1 ? 's' : ''}</p>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          );
                        }

                        return linkContent;
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Bottom accent */}
        {!collapsed && (
          <div className="p-3 border-t border-border/50">
            <div className="glass rounded-xl p-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-caption text-muted-foreground font-body">Sistema online</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}
