import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Users, Building2, FileText, Calendar,
  Clock, Gift, BarChart3, Settings, FileCheck,
  Zap, ChevronRight, UserPlus, UserMinus, Briefcase,
  FolderOpen, CalendarDays, Plug, Database,
  Network, Shield, UserCog, Lock,
  Timer, GraduationCap, ClipboardList, Heart,
  Megaphone, Scale, MapPin, FileBarChart,
  Wallet, HardHat, UserX, Compass, DollarSign,
  Layers, Stethoscope, BookOpen, Landmark,
  Receipt, PenTool, Workflow, Globe, BadgeAlert,
  CreditCard, ShieldCheck, ScrollText, Bot,
} from 'lucide-react';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEmpresas } from '@/hooks/useEmpresas';
import { EmpresaSelector } from './EmpresaSelector';
import { SidebarFooter } from './SidebarFooter';

/* ─── Menu Structure ─── */
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
      { path: '/dashboard-executivo', label: 'Dashboard Executivo', icon: BarChart3 },
      { path: '/empresas', label: 'Empresas', icon: Building2 },
      { path: '/portal', label: 'Portal', icon: Globe },
      { path: '/assistente-ia', label: 'Assistente IA', icon: Bot },
    ],
  },
  {
    label: 'Pessoas',
    items: [
      { path: '/colaboradores', label: 'Colaboradores', icon: Users },
      { path: '/admissoes', label: 'Admissões', icon: UserPlus },
      { path: '/desligamentos', label: 'Desligamentos', icon: UserMinus },
      { path: '/times', label: 'Times', icon: Users },
    ],
  },
  {
    label: 'Operações',
    items: [
      { path: '/folha', label: 'Folha', icon: FileText },
      { path: '/provisoes', label: 'Provisões', icon: Wallet },

      { path: '/holerites', label: 'Holerites', icon: Receipt },
      { path: '/ponto', label: 'Ponto', icon: Clock },
      { path: '/banco-horas', label: 'Banco de Horas', icon: Timer },
      { path: '/horas-extras', label: 'Horas Extras', icon: Clock },
      { path: '/ferias', label: 'Férias', icon: Calendar },
      { path: '/faltas', label: 'Faltas', icon: UserX },
      { path: '/afastamentos', label: 'Afastamentos', icon: Shield },
      { path: '/turnos', label: 'Turnos', icon: Compass },
      { path: '/escalas', label: 'Escalas', icon: CalendarDays },
      { path: '/jornadas', label: 'Jornadas', icon: ClipboardList },
    ],
  },
  {
    label: 'Gestão',
    items: [
      { path: '/beneficios', label: 'Benefícios', icon: Gift },
      { path: '/planos-saude', label: 'Planos de Saúde', icon: Heart },
      { path: '/seguros-vida', label: 'Seguros de Vida', icon: ShieldCheck },
      { path: '/vales', label: 'Vales', icon: CreditCard },
      { path: '/convenios', label: 'Convênios', icon: BookOpen },
      { path: '/cargos', label: 'Cargos', icon: Briefcase },
      { path: '/departamentos', label: 'Departamentos', icon: Building2 },
      { path: '/centros-custo', label: 'Centros de Custo', icon: Layers },
      { path: '/lotacoes', label: 'Lotações', icon: MapPin },
      { path: '/documentos', label: 'Documentos', icon: FolderOpen },
      { path: '/feriados', label: 'Feriados', icon: CalendarDays },
      { path: '/organograma', label: 'Organograma', icon: Network },
      { path: '/movimentacoes', label: 'Movimentações', icon: FileBarChart },
      { path: '/despesas', label: 'Despesas', icon: DollarSign },
      { path: '/pensoes', label: 'Pensões', icon: Wallet },
    ],
  },
  {
    label: 'Desenvolvimento',
    items: [
      { path: '/treinamentos', label: 'Treinamentos', icon: GraduationCap },
      { path: '/avaliacao', label: 'Avaliação', icon: ClipboardList },
      { path: '/pesquisas-clima', label: 'Pesquisas de Clima', icon: Megaphone },
      { path: '/recrutamento', label: 'Recrutamento', icon: UserPlus },
      { path: '/onboarding', label: 'Onboarding', icon: Compass },
    ],
  },
  {
    label: 'SST & Compliance',
    items: [
      { path: '/sst', label: 'SST', icon: HardHat },
      { path: '/exames', label: 'Exames / ASOs', icon: Stethoscope },
      { path: '/epis', label: 'EPIs', icon: HardHat },
      { path: '/medidas-disciplinares', label: 'Medidas Disciplinares', icon: BadgeAlert },
      { path: '/sindicatos', label: 'Sindicatos', icon: Landmark },
      { path: '/canal-etica', label: 'Canal de Ética', icon: Scale },
      { path: '/locais-trabalho', label: 'Locais de Trabalho', icon: MapPin },
    ],
  },
  {
    label: 'Relatórios',
    items: [
      { path: '/relatorios', label: 'Relatórios', icon: BarChart3 },
      { path: '/esocial', label: 'eSocial', icon: FileCheck },
      { path: '/obrigacoes-fiscais', label: 'Obrigações Fiscais', icon: ScrollText },
      { path: '/calculadora-rescisao', label: 'Calculadora Rescisão', icon: DollarSign },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { path: '/usuarios', label: 'Usuários', icon: UserCog },
      { path: '/controle-acesso', label: 'Controle de Acesso', icon: Lock },
      { path: '/seguranca', label: 'Segurança', icon: ShieldCheck },
      { path: '/auditoria', label: 'Auditoria', icon: Shield },
      { path: '/assinaturas', label: 'Assinaturas', icon: PenTool },
      { path: '/gerador-documentos', label: 'Gerador Docs', icon: FileText },
      { path: '/workflows', label: 'Workflows', icon: Workflow },
      { path: '/comunicacao', label: 'Comunicação', icon: Megaphone },
      { path: '/notificacoes', label: 'Notificações', icon: Shield },
      { path: '/importacao', label: 'Importação', icon: Database },
      { path: '/integracoes', label: 'Integrações', icon: Plug },
      { path: '/lgpd', label: 'LGPD', icon: ShieldCheck },
      { path: '/telemetria', label: 'Telemetria', icon: BarChart3 },
      { path: '/backup', label: 'Backup', icon: Database },
      { path: '/perfil', label: 'Meu Perfil', icon: UserCog },
      { path: '/configuracoes', label: 'Configurações', icon: Settings },
    ],
  },
];

/* ─── Props ─── */
interface SidebarProps {
  collapsed?: boolean;
  className?: string;
  pendingCounts?: Record<string, number>;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, className, pendingCounts, onToggle }: SidebarProps) {
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();
  const { userEmpresas, empresaAtual, trocarEmpresa, temMultiplasEmpresas } = useEmpresas();

  const activeGroupLabel = menuGroups.find(g =>
    g.items.some(item => location.pathname === item.path || location.pathname.startsWith(item.path + '/'))
  )?.label || 'Principal';

  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    menuGroups.forEach(g => {
      initial[g.label] = g.label !== activeGroupLabel;
    });
    return initial;
  });

  const toggleGroup = (label: string) => {
    if (collapsed) return;
    setCollapsedGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const getBadge = (path: string): number | undefined => pendingCounts?.[path];

  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        role="navigation"
        aria-label="Menu principal"
        className={cn(
          'flex flex-col h-full border-r border-sidebar-border',
          'bg-sidebar transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          className
        )}
      >
        {/* ─── Logo ─── */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_hsl(68_100%_48%/0.3)]">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success animate-pulse-glow" />
            </div>
            {!collapsed && (
              <div className="flex-1">
                <h1 className="font-display font-bold text-lg tracking-tight text-foreground">
                  Dept. Pessoal
                </h1>
                <p className="text-overline text-muted-foreground">Sistema DP</p>
              </div>
            )}
            <button 
              onClick={onToggle}
              className="p-1.5 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors hidden lg:block"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* ─── Company Switcher ─── */}
        <EmpresaSelector
          collapsed={collapsed}
          empresaAtual={empresaAtual}
          userEmpresas={userEmpresas}
          temMultiplasEmpresas={temMultiplasEmpresas}
          trocarEmpresa={trocarEmpresa}
        />

        {/* ─── Navigation ─── */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar" aria-label="Módulos do sistema">
          {menuGroups.map((group, gi) => {
            const isGroupCollapsed = collapsedGroups[group.label];

            return (
              <div key={group.label} className={cn(gi > 0 && 'mt-2')}>
                {!collapsed ? (
                  <button
                    onClick={() => toggleGroup(group.label)}
                    aria-expanded={!isGroupCollapsed}
                    aria-controls={`sidebar-group-${gi}`}
                    className="w-full flex items-center justify-between px-3 py-1.5 mb-0.5 group/header"
                  >
                    <span className="text-overline text-muted-foreground/80 group-hover/header:text-foreground transition-colors font-bold tracking-wider">
                      {group.label}
                    </span>
                    <ChevronRight className={cn(
                      'h-3 w-3 text-muted-foreground/30 transition-transform duration-200',
                      !isGroupCollapsed && 'rotate-90'
                    )} />
                  </button>
                ) : (
                  gi > 0 && <div className="h-px bg-sidebar-border mx-2 my-2" />
                )}

                <AnimatePresence initial={false}>
                  {!isGroupCollapsed && (
                    <motion.div
                      id={`sidebar-group-${gi}`}
                      initial={false}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-0.5 overflow-hidden"
                    >
                      {group.items.map(({ path, label, icon: Icon }) => {
                        // Admin-only paths
                        const adminPaths = ['/usuarios', '/seguranca', '/auditoria', '/telemetria', '/lgpd', '/controle-acesso'];
                        if (adminPaths.includes(path) && !isAdmin) return null;

                        const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
                        const badge = getBadge(path);

                        const linkContent = (
                          <Link
                            key={path}
                            to={path}
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={label}
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
                              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
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

        {/* ─── User Profile Footer ─── */}
        <SidebarFooter
          collapsed={collapsed}
          user={user}
          userInitials={userInitials}
          onSignOut={signOut}
        />
      </aside>
    </TooltipProvider>
  );
}
