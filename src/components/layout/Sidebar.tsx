import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Users, Building2, FileText, Calendar,
  Clock, Gift, BarChart3, Settings, FileCheck,
  Zap, ChevronDown, UserPlus, UserMinus, Briefcase,
  FolderOpen, CalendarDays, Plug, Database,
  Network, Shield, UserCog, LogOut, Check, ChevronRight,
  Timer, GraduationCap, ClipboardList, Heart,
  Megaphone, Scale, MapPin, Lock, FileBarChart,
  Wallet, HardHat, UserX, Compass, DollarSign,
  Layers, TreePine, Stethoscope, BookOpen, Landmark,
  Receipt, PenTool, Workflow, Globe, BadgeAlert,
  CreditCard, ShieldCheck, ScrollText,
} from 'lucide-react';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEmpresas } from '@/hooks/useEmpresas';

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
      { path: '/auditoria', label: 'Auditoria', icon: Shield },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { path: '/usuarios', label: 'Usuários', icon: UserCog },
      { path: '/controle-acesso', label: 'Controle de Acesso', icon: Lock },
      { path: '/assinaturas', label: 'Assinaturas', icon: PenTool },
      { path: '/workflows', label: 'Workflows', icon: Workflow },
      { path: '/comunicacao', label: 'Comunicação', icon: Megaphone },
      { path: '/integracoes', label: 'Integrações', icon: Plug },
      { path: '/lgpd', label: 'LGPD', icon: ShieldCheck },
      { path: '/backup', label: 'Backup', icon: Database },
      { path: '/configuracoes', label: 'Configurações', icon: Settings },
    ],
  },
];

/* ─── Props ─── */
interface SidebarProps {
  collapsed?: boolean;
  className?: string;
  pendingCounts?: Record<string, number>;
}

export function Sidebar({ collapsed = false, className, pendingCounts }: SidebarProps) {
  const location = useLocation();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const { user, signOut } = useAuth();
  const { userEmpresas, empresaAtual, trocarEmpresa, temMultiplasEmpresas } = useEmpresas();
  const [empresaMenuOpen, setEmpresaMenuOpen] = useState(false);

  const toggleGroup = (label: string) => {
    if (collapsed) return;
    setCollapsedGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const getBadge = (path: string): number | undefined => {
    if (pendingCounts) return pendingCounts[path];
    return undefined;
  };

  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  const empresaNome = empresaAtual?.nome_fantasia || empresaAtual?.razao_social || 'Sem empresa';

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
              <div>
                <h1 className="font-display font-bold text-lg tracking-tight text-foreground">
                  Dept. Pessoal
                </h1>
                <p className="text-overline text-muted-foreground">Sistema DP</p>
              </div>
            )}
          </div>
        </div>

        {/* ─── Company Switcher ─── */}
        {!collapsed ? (
          <div className="px-3 pt-3 pb-1">
            <button
              onClick={() => temMultiplasEmpresas && setEmpresaMenuOpen(!empresaMenuOpen)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200',
                'bg-sidebar-accent/60 hover:bg-sidebar-accent border border-border/20',
                temMultiplasEmpresas && 'cursor-pointer'
              )}
            >
              <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-body font-medium text-foreground truncate">{empresaNome}</p>
                <p className="text-[10px] text-muted-foreground font-body">
                  {empresaAtual?.cnpj || 'Empresa ativa'}
                </p>
              </div>
              {temMultiplasEmpresas && (
                <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground/50 transition-transform', empresaMenuOpen && 'rotate-180')} />
              )}
            </button>

            <AnimatePresence>
              {empresaMenuOpen && temMultiplasEmpresas && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <div className="mt-1 rounded-xl border border-border/20 bg-sidebar-accent/40 p-1">
                    {userEmpresas?.map((ue) => (
                      <button
                        key={ue.empresa_id}
                        onClick={() => { trocarEmpresa(ue.empresa_id); setEmpresaMenuOpen(false); }}
                        className={cn(
                          'w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors',
                          ue.empresa_id === empresaAtual?.id
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-sidebar-accent text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="text-xs font-body truncate flex-1">
                          {ue.empresa?.nome_fantasia || ue.empresa?.razao_social}
                        </span>
                        {ue.empresa_id === empresaAtual?.id && <Check className="h-3.5 w-3.5 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="px-2 pt-3 pb-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-10 w-10 mx-auto rounded-xl bg-sidebar-accent/60 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right"><p>{empresaNome}</p></TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* ─── Navigation ─── */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
          {menuGroups.map((group, gi) => {
            const isGroupCollapsed = collapsedGroups[group.label];

            return (
              <div key={group.label} className={cn(gi > 0 && 'mt-2')}>
                {!collapsed ? (
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className="w-full flex items-center justify-between px-3 py-1.5 mb-0.5 group/header"
                  >
                    <span className="text-overline text-muted-foreground/50 group-hover/header:text-muted-foreground transition-colors">
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

        {/* ─── User Profile Footer ─── */}
        <div className="border-t border-sidebar-border p-3">
          {!collapsed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-2 py-2">
                <Avatar className="h-9 w-9 ring-2 ring-border/30">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-medium text-foreground truncate">
                    {user?.name || user?.email || 'Usuário'}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-body truncate">
                    {user?.email || ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors text-sm font-body"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center justify-center py-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right"><p>Sair</p></TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
