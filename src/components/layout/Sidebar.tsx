import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Users, Building2, FileText, Calendar,
  Clock, Gift, BarChart3, Settings, FileCheck,
  Zap, ChevronDown, UserPlus, UserMinus, Briefcase,
  FolderOpen, CalendarDays, Bell, Plug, Database,
  Network, Shield, UserCog,
} from 'lucide-react';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
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
  badge?: number;
}

const menuGroups: MenuGroup[] = [
  {
    label: 'Principal',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: Home },
      { path: '/colaboradores', label: 'Colaboradores', icon: Users },
      { path: '/empresas', label: 'Empresas', icon: Building2 },
    ],
  },
  {
    label: 'Operações',
    items: [
      { path: '/admissoes', label: 'Admissões', icon: UserPlus },
      { path: '/desligamentos', label: 'Desligamentos', icon: UserMinus },
      { path: '/folha', label: 'Folha', icon: FileText },
      { path: '/ferias', label: 'Férias', icon: Calendar },
      { path: '/ponto', label: 'Ponto', icon: Clock },
      { path: '/afastamentos', label: 'Afastamentos', icon: Shield },
    ],
  },
  {
    label: 'Gestão',
    items: [
      { path: '/beneficios', label: 'Benefícios', icon: Gift },
      { path: '/cargos', label: 'Cargos', icon: Briefcase },
      { path: '/departamentos', label: 'Departamentos', icon: Building2 },
      { path: '/documentos', label: 'Documentos', icon: FolderOpen },
      { path: '/feriados', label: 'Feriados', icon: CalendarDays },
      { path: '/organograma', label: 'Organograma', icon: Network },
    ],
  },
  {
    label: 'Relatórios & eSocial',
    items: [
      { path: '/relatorios', label: 'Relatórios', icon: BarChart3 },
      { path: '/esocial', label: 'eSocial', icon: FileCheck },
      { path: '/auditoria', label: 'Auditoria', icon: Shield },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { path: '/usuarios', label: 'Usuários', icon: UserCog },
      { path: '/integracoes', label: 'Integrações', icon: Plug },
      { path: '/backup', label: 'Backup', icon: Database },
      { path: '/configuracoes', label: 'Configurações', icon: Settings },
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

  const getBadge = (path: string): number | undefined => {
    if (pendingCounts) return pendingCounts[path];
    return undefined;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'flex flex-col h-full border-r border-sidebar-border',
          'bg-sidebar transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          className
        )}
      >
        {/* Logo — Bombon style */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_hsl(68_100%_48%/0.3)]">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success animate-pulse-glow" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="font-display font-bold text-lg tracking-tight text-foreground">
                  Dept. Pessoal
                </h1>
                <p className="text-overline text-muted-foreground">Sistema DP</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
          {menuGroups.map((group, gi) => {
            const isGroupCollapsed = collapsedGroups[group.label];

            return (
              <div key={group.label} className={cn(gi > 0 && 'mt-3')}>
                {!collapsed ? (
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className="w-full flex items-center justify-between px-3 py-1.5 mb-1 group/header"
                  >
                    <span className="text-overline text-muted-foreground/50 group-hover/header:text-muted-foreground transition-colors">
                      {group.label}
                    </span>
                    <ChevronDown className={cn(
                      'h-3 w-3 text-muted-foreground/30 transition-transform duration-200',
                      isGroupCollapsed && '-rotate-90'
                    )} />
                  </button>
                ) : (
                  gi > 0 && <div className="h-px bg-sidebar-border mx-2 my-2" />
                )}

                <AnimatePresence initial={false}>
                  {!isGroupCollapsed && (
                    <motion.div
                      initial={false}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-0.5 overflow-hidden"
                    >
                      {group.items.map(({ path, label, icon: Icon }) => {
                        const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
                        const badge = getBadge(path);

                        const linkContent = (
                          <Link
                            key={path}
                            to={path}
                            className={cn(
                              'group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 font-body text-sm',
                              isActive
                                ? 'bg-primary text-primary-foreground font-semibold shadow-[0_0_16px_hsl(68_100%_48%/0.25)]'
                                : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent',
                              collapsed && 'justify-center px-0'
                            )}
                          >
                            <div className={cn(
                              'flex items-center justify-center transition-transform duration-200',
                              !isActive && 'group-hover:scale-110'
                            )}>
                              <Icon className="h-[18px] w-[18px]" />
                            </div>
                            {!collapsed && <span className="flex-1">{label}</span>}
                            {!collapsed && badge !== undefined && badge > 0 && (
                              <span className="min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                                {badge > 99 ? '99+' : badge}
                              </span>
                            )}
                            {collapsed && badge !== undefined && badge > 0 && (
                              <div className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
                            )}
                          </Link>
                        );

                        if (collapsed) {
                          return (
                            <Tooltip key={path}>
                              <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
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

        {/* Bottom status */}
        {!collapsed && (
          <div className="p-3 border-t border-sidebar-border">
            <div className="rounded-lg bg-sidebar-accent p-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-caption text-muted-foreground font-body">Sistema online</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}
