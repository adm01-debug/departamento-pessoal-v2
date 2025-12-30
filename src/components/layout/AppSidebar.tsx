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
  ChevronDown,
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
  Calculator,
  Settings,
  Briefcase,
  FileText,
  LucideIcon
} from 'lucide-react';
import { NotificacoesDropdown } from '@/components/NotificacoesDropdown';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState, memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { EmpresaSelector } from '@/components/empresa/EmpresaSelector';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

// Tipos
interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
  color: string;
}

interface MenuGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  items: MenuItem[];
}

// Grupos de menu organizados por categoria
const menuGroups: MenuGroup[] = [
  {
    id: 'principal',
    label: 'Principal',
    icon: LayoutDashboard,
    color: 'text-primary',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/', color: 'text-primary' },
      { icon: Users, label: 'Colaboradores', path: '/colaboradores', color: 'text-info' },
      { icon: Network, label: 'Organograma', path: '/organograma', color: 'text-info' },
    ]
  },
  {
    id: 'gestao-pessoas',
    label: 'Gestão de Pessoas',
    icon: Briefcase,
    color: 'text-success',
    items: [
      { icon: UserPlus, label: 'Admissão', path: '/admissao', color: 'text-success' },
      { icon: ClipboardList, label: 'Onboarding', path: '/onboarding', color: 'text-success' },
      { icon: UserMinus, label: 'Desligamento', path: '/desligamento', color: 'text-destructive' },
    ]
  },
  {
    id: 'tempo-ausencias',
    label: 'Tempo & Ausências',
    icon: Clock,
    color: 'text-info',
    items: [
      { icon: Clock, label: 'Ponto', path: '/ponto', color: 'text-info' },
      { icon: Umbrella, label: 'Férias', path: '/ferias', color: 'text-warning' },
      { icon: Heart, label: 'Afastamentos', path: '/afastamentos', color: 'text-loggi' },
      { icon: Calendar, label: 'Feriados', path: '/feriados', color: 'text-warning' },
    ]
  },
  {
    id: 'remuneracao',
    label: 'Remuneração',
    icon: Wallet,
    color: 'text-sales',
    items: [
      { icon: Wallet, label: 'Folha de Pagamento', path: '/folha', color: 'text-sales' },
      { icon: Gift, label: 'Benefícios', path: '/beneficios', color: 'text-store' },
      { icon: Calculator, label: 'Contábil', path: '/contabil', color: 'text-info' },
    ]
  },
  {
    id: 'documentos',
    label: 'Documentos & Compliance',
    icon: FileText,
    color: 'text-warning',
    items: [
      { icon: FileCheck, label: 'Documentos', path: '/documentos', color: 'text-warning' },
      { icon: PenTool, label: 'Assinaturas', path: '/assinaturas', color: 'text-info' },
      { icon: History, label: 'Auditoria', path: '/auditoria', color: 'text-primary' },
    ]
  },
  {
    id: 'administracao',
    label: 'Administração',
    icon: Settings,
    color: 'text-muted-foreground',
    items: [
      { icon: BarChart3, label: 'Relatórios', path: '/relatorios', color: 'text-muted-foreground' },
      { icon: Shield, label: 'Usuários', path: '/usuarios', color: 'text-warning' },
    ]
  },
];

// Item individual do portal
const portalItem: MenuItem = { 
  icon: UserCircle, 
  label: 'Meu Portal', 
  path: '/portal', 
  color: 'text-success' 
};

interface AppSidebarProps {
  onSearchOpen?: () => void;
}

// Componente de Item de Menu
const SidebarMenuItem = memo(function SidebarMenuItem({ 
  item, 
  isActive, 
  collapsed 
}: { 
  item: MenuItem; 
  isActive: boolean; 
  collapsed: boolean;
}) {
  const content = (
    <NavLink
      to={item.path}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
        collapsed && "justify-center px-2"
      )}
    >
      <item.icon className={cn(
        "w-4 h-4 shrink-0 transition-colors",
        isActive ? item.color : "text-sidebar-foreground group-hover:" + item.color
      )} />
      {!collapsed && (
        <>
          <span className="text-sm font-medium truncate flex-1">{item.label}</span>
          {isActive && (
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          )}
        </>
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
});

// Componente de Grupo Colapsável
const SidebarMenuGroup = memo(function SidebarMenuGroup({ 
  group, 
  collapsed, 
  currentPath,
  isOpen,
  onToggle
}: { 
  group: MenuGroup; 
  collapsed: boolean;
  currentPath: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const hasActiveItem = group.items.some(item => item.path === currentPath);
  const GroupIcon = group.icon;

  if (collapsed) {
    // No modo colapsado, mostra apenas os ícones dos itens
    return (
      <div className="space-y-1">
        {group.items.map((item) => (
          <SidebarMenuItem
            key={item.path}
            item={item}
            isActive={currentPath === item.path}
            collapsed={collapsed}
          />
        ))}
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all duration-200 group",
            "text-sidebar-foreground hover:bg-sidebar-accent/30",
            hasActiveItem && "bg-sidebar-accent/20"
          )}
        >
          <GroupIcon className={cn(
            "w-4 h-4 shrink-0 transition-colors",
            hasActiveItem ? group.color : "text-sidebar-foreground/70"
          )} />
          <span className={cn(
            "text-xs font-semibold uppercase tracking-wider flex-1 text-left",
            hasActiveItem ? "text-sidebar-foreground" : "text-sidebar-foreground/70"
          )}>
            {group.label}
          </span>
          <ChevronDown className={cn(
            "w-4 h-4 text-sidebar-foreground/50 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
          {hasActiveItem && (
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 space-y-0.5 mt-1 animate-accordion-down">
        {group.items.map((item) => (
          <SidebarMenuItem
            key={item.path}
            item={item}
            isActive={currentPath === item.path}
            collapsed={false}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
});

export function AppSidebar({ onSearchOpen }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    // Inicializa todos os grupos como abertos
    const initial: Record<string, boolean> = {};
    menuGroups.forEach(group => {
      initial[group.id] = true;
    });
    return initial;
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logout realizado com sucesso');
    navigate('/auth');
  };

  const toggleGroup = useCallback((groupId: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Expande automaticamente o grupo que contém a rota ativa
  const currentPath = location.pathname;

  return (
    <TooltipProvider delayDuration={0}>
      <aside 
        className={cn(
          "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="p-3 border-b border-sidebar-border flex flex-col gap-2">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-md">
                  <Users className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-foreground text-sm">Sistema DP</h1>
                  <p className="text-[10px] text-muted-foreground">Departamento Pessoal</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-0.5">
              {!collapsed && <NotificacoesDropdown />}
              {!collapsed && <ThemeToggle />}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setCollapsed(!collapsed)}
                className="h-8 w-8 hover:bg-sidebar-accent"
              >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {/* Seletor de Empresa */}
          {!collapsed && (
            <div className="pt-1">
              <EmpresaSelector />
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="px-2 py-2">
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start gap-2 text-muted-foreground hover:text-foreground bg-sidebar-accent/30 border-sidebar-border",
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

        {/* Portal do Colaborador - Destaque especial */}
        <div className="px-2 pb-2">
          <SidebarMenuItem
            item={portalItem}
            isActive={currentPath === portalItem.path}
            collapsed={collapsed}
          />
        </div>

        {/* Separator */}
        <div className="mx-3 h-px bg-sidebar-border" />

        {/* Navigation Groups */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin">
          {menuGroups.map((group) => (
            <SidebarMenuGroup
              key={group.id}
              group={group}
              collapsed={collapsed}
              currentPath={currentPath}
              isOpen={openGroups[group.id] ?? true}
              onToggle={() => toggleGroup(group.id)}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className={cn(
          "border-t border-sidebar-border transition-all duration-200",
          collapsed ? "p-2" : "p-3"
        )}>
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <NavLink
                    to="/perfil"
                    className={cn(
                      "w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center transition-colors",
                      location.pathname === '/perfil' && "ring-2 ring-primary"
                    )}
                  >
                    <span className="text-xs font-semibold text-primary">
                      {profile?.nome ? getInitials(profile.nome) : '??'}
                    </span>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {profile?.nome || 'Perfil'}
                </TooltipContent>
              </Tooltip>
              
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Sair</TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <div className="space-y-2">
              <NavLink
                to="/perfil"
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg transition-colors",
                  location.pathname === '/perfil' 
                    ? "bg-sidebar-accent" 
                    : "hover:bg-sidebar-accent/50"
                )}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                  <span className="text-xs font-semibold text-primary">
                    {profile?.nome ? getInitials(profile.nome) : '??'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {profile?.nome || 'Carregando...'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile?.cargo || 'Usuário'}
                  </p>
                </div>
              </NavLink>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Sair do Sistema
              </Button>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
