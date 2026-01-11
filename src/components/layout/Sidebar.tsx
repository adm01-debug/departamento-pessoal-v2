// V15-193: src/components/layout/Sidebar.tsx
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Building2, FileText, Calendar, Clock, Gift, BarChart3, Settings, FileCheck } from 'lucide-react';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/colaboradores', label: 'Colaboradores', icon: Users },
  { path: '/empresas', label: 'Empresas', icon: Building2 },
  { path: '/folha', label: 'Folha', icon: FileText },
  { path: '/ferias', label: 'Férias', icon: Calendar },
  { path: '/ponto', label: 'Ponto', icon: Clock },
  { path: '/beneficios', label: 'Benefícios', icon: Gift },
  { path: '/relatorios', label: 'Relatórios', icon: BarChart3 },
  { path: '/esocial', label: 'eSocial', icon: FileCheck },
  { path: '/configuracoes', label: 'Configurações', icon: Settings },
];

interface SidebarProps {
  collapsed?: boolean;
  className?: string;
}

export function Sidebar({ collapsed = false, className }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className={cn('flex flex-col h-full bg-card border-r', collapsed ? 'w-16' : 'w-64', className)}>
      <div className="p-4 border-b">
        <h1 className={cn('font-bold text-primary', collapsed ? 'text-center text-xl' : 'text-xl')}>
          {collapsed ? 'DP' : 'Dept. Pessoal'}
        </h1>
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
