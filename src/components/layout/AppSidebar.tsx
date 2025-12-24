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
  ChevronRight,
  Search,
  LogOut,
  History,
  Calendar,
  Building2,
  Shield,
  PenTool,
  UserCircle,
  Network,
  ClipboardList,
  FileCheck,
  Calculator
} from 'lucide-react';
import { NotificacoesDropdown } from '@/components/NotificacoesDropdown';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState, memo } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { EmpresaSelector } from '@/components/empresa/EmpresaSelector';

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
  { icon: Calendar, label: 'Feriados', path: '/feriados', color: 'text-warning' },
  { icon: BarChart3, label: 'Relatórios', path: '/relatorios', color: 'text-muted-foreground' },
  { icon: History, label: 'Auditoria', path: '/auditoria', color: 'text-primary' },
  { icon: Shield, label: 'Usuários', path: '/usuarios', color: 'text-warning' },
  { icon: PenTool, label: 'Assinaturas', path: '/assinaturas', color: 'text-info' },
  { icon: UserCircle, label: 'Meu Portal', path: '/portal', color: 'text-success' },
  { icon: Network, label: 'Organograma', path: '/organograma', color: 'text-info' },
  { icon: ClipboardList, label: 'Onboarding', path: '/onboarding', color: 'text-success' },
  { icon: FileCheck, label: 'Documentos', path: '/documentos', color: 'text-warning' },
  { icon: Calculator, label: 'Contábil', path: '/contabil', color: 'text-info' },
];

interface AppSidebarProps {
  onSearchOpen?: () => void;
}

export function AppSidebar({ onSearchOpen }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logout realizado com sucesso');
    navigate('/auth');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside 
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex flex-col gap-2">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Users className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display font-bold text-foreground text-sm">Sistema DP</h1>
                <p className="text-xs text-muted-foreground">Depto. Pessoal</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-1">
            <NotificacoesDropdown />
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {/* Seletor de Empresa */}
        {!collapsed && (
          <div className="pt-2">
            <EmpresaSelector />
          </div>
        )}
      </div>

      {/* Search Button */}
      <div className="px-2 py-2">
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start gap-2 text-muted-foreground hover:text-foreground bg-sidebar-accent/30",
            collapsed && "justify-center px-0"
          )}
          onClick={onSearchOpen}
        >
          <Search className="h-4 w-4 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left text-sm">Buscar...</span>
              <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </>
          )}
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
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <NavLink
            to="/perfil"
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg transition-colors",
              location.pathname === '/perfil' 
                ? "bg-sidebar-accent" 
                : "hover:bg-sidebar-accent/50"
            )}
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">
                {profile?.nome ? getInitials(profile.nome) : '??'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {profile?.nome || 'Carregando...'}
              </p>
              <p className="text-xs text-muted-foreground">
                {profile?.cargo || 'Usuário'}
              </p>
            </div>
          </NavLink>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      )}
    </aside>
  );
}



