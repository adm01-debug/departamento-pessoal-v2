import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Users, Building2, FileText, Calendar,
  Clock, Gift, BarChart3, Settings, FileCheck,
  Zap,
} from 'lucide-react';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home, color: 'from-primary to-primary-glow' },
  { path: '/colaboradores', label: 'Colaboradores', icon: Users, color: 'from-info to-level' },
  { path: '/empresas', label: 'Empresas', icon: Building2, color: 'from-xp to-tasks' },
  { path: '/folha', label: 'Folha', icon: FileText, color: 'from-finance to-success' },
  { path: '/ferias', label: 'Férias', icon: Calendar, color: 'from-warning to-coins' },
  { path: '/ponto', label: 'Ponto', icon: Clock, color: 'from-streak to-warning' },
  { path: '/beneficios', label: 'Benefícios', icon: Gift, color: 'from-xp to-store' },
  { path: '/relatorios', label: 'Relatórios', icon: BarChart3, color: 'from-info to-primary' },
  { path: '/esocial', label: 'eSocial', icon: FileCheck, color: 'from-success to-finance' },
  { path: '/configuracoes', label: 'Configurações', icon: Settings, color: 'from-muted-foreground to-foreground' },
];

interface SidebarProps {
  collapsed?: boolean;
  className?: string;
}

export function Sidebar({ collapsed = false, className }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'flex flex-col h-full border-r border-border/50',
        'bg-gradient-to-b from-card via-card to-card/80',
        'backdrop-blur-xl',
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
              <p className="text-[10px] text-muted-foreground font-body tracking-wider uppercase">
                Sistema DP
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map(({ path, label, icon: Icon, color }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 font-body text-sm',
                isActive
                  ? 'text-primary-foreground shadow-elevated'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
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
                <span className="relative z-10 font-medium">
                  {label}
                </span>
              )}

              {/* Hover glow effect */}
              {!isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom accent */}
      {!collapsed && (
        <div className="p-3 border-t border-border/50">
          <div className="glass rounded-xl p-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-muted-foreground font-body">Sistema online</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
