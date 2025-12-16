import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Clock, 
  Umbrella, 
  Heart, 
  Wallet, 
  Gift, 
  UserMinus, 
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/', color: 'text-primary' },
  { icon: Users, label: 'Colaboradores', path: '/colaboradores', color: 'text-info' },
  { icon: UserPlus, label: 'Admissão', path: '/admissao', color: 'text-success' },
  { icon: Clock, label: 'Ponto', path: '/ponto', color: 'text-info' },
  { icon: Umbrella, label: 'Férias', path: '/ferias', color: 'text-warning' },
  { icon: Heart, label: 'Afastamentos', path: '/afastamentos', color: 'text-loggi' },
  { icon: Wallet, label: 'Folha', path: '/folha', color: 'text-sales' },
  { icon: Gift, label: 'Benefícios', path: '/beneficios', color: 'text-store' },
  { icon: UserMinus, label: 'Desligamento', path: '/desligamento', color: 'text-destructive' },
  { icon: BarChart3, label: 'Relatórios', path: '/relatorios', color: 'text-muted-foreground' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Users className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-foreground text-sm">Promo Brindes</h1>
              <p className="text-xs text-muted-foreground">Depto. Pessoal</p>
            </div>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 shrink-0 transition-colors",
                isActive ? item.color : "text-sidebar-foreground group-hover:" + item.color
              )} />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">AS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Ana Silva</p>
              <p className="text-xs text-muted-foreground">Analista DP</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
