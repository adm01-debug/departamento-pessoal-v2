import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Users, Building2, FileText, Calendar,
  Clock, Gift, BarChart3, Settings, FileCheck,
  Search, UserPlus, DollarSign, ArrowRight,
  Zap, Calculator, Upload, Plus,
} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  category: 'navigation' | 'action' | 'search';
  path?: string;
  action?: () => void;
  gradient: string;
  shortcut?: string;
}

const commands: CommandItem[] = [
  // Navigation
  { id: 'dashboard', label: 'Dashboard', description: 'Visão geral do sistema', icon: Home, category: 'navigation', path: '/dashboard', gradient: 'from-primary to-primary-glow' },
  { id: 'colaboradores', label: 'Colaboradores', description: 'Gestão de funcionários', icon: Users, category: 'navigation', path: '/colaboradores', gradient: 'from-primary to-primary-glow' },
  { id: 'empresas', label: 'Empresas', description: 'Cadastro de empresas', icon: Building2, category: 'navigation', path: '/empresas', gradient: 'from-primary/80 to-primary' },
  { id: 'folha', label: 'Folha de Pagamento', description: 'Cálculos e holerites', icon: FileText, category: 'navigation', path: '/folha', gradient: 'from-primary-glow to-primary' },
  { id: 'ferias', label: 'Férias', description: 'Programação de férias', icon: Calendar, category: 'navigation', path: '/ferias', gradient: 'from-primary-glow to-primary' },
  { id: 'ponto', label: 'Ponto Eletrônico', description: 'Registro e espelho', icon: Clock, category: 'navigation', path: '/ponto', gradient: 'from-primary/60 to-primary/90' },
  { id: 'beneficios', label: 'Benefícios', description: 'Gestão de benefícios', icon: Gift, category: 'navigation', path: '/beneficios', gradient: 'from-xp to-store' },
  { id: 'relatorios', label: 'Relatórios', description: 'Relatórios e exportações', icon: BarChart3, category: 'navigation', path: '/relatorios', gradient: 'from-info to-primary' },
  { id: 'esocial', label: 'eSocial', description: 'Eventos e transmissão', icon: FileCheck, category: 'navigation', path: '/esocial', gradient: 'from-primary to-primary-glow' },
  { id: 'configuracoes', label: 'Configurações', description: 'Preferências do sistema', icon: Settings, category: 'navigation', path: '/configuracoes', gradient: 'from-muted-foreground to-foreground' },
  // Actions
  { id: 'novo-colaborador', label: 'Novo Colaborador', description: 'Cadastrar funcionário', icon: UserPlus, category: 'action', path: '/colaboradores/novo', gradient: 'from-primary to-primary-glow', shortcut: 'N' },
  { id: 'calcular-folha', label: 'Calcular Folha', description: 'Processar folha do mês', icon: Calculator, category: 'action', path: '/folha/calcular', gradient: 'from-primary-glow to-primary', shortcut: 'F' },
  { id: 'nova-empresa', label: 'Nova Empresa', description: 'Cadastrar empresa', icon: Plus, category: 'action', path: '/empresas/nova', gradient: 'from-primary/80 to-primary' },
  { id: 'novo-beneficio', label: 'Novo Benefício', description: 'Adicionar benefício', icon: Gift, category: 'action', path: '/beneficios/novo', gradient: 'from-xp to-store' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // ⌘K / Ctrl+K to toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
        setQuery('');
        setSelectedIndex(0);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filtered = useMemo(() => {
    if (!query) return commands;
    const q = query.toLowerCase();
    return commands.filter(c =>
      c.label.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      c.category.includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const nav = filtered.filter(c => c.category === 'navigation');
    const act = filtered.filter(c => c.category === 'action');
    return { navigation: nav, action: act };
  }, [filtered]);

  const allItems = useMemo(() => [...grouped.navigation, ...grouped.action], [grouped]);

  const execute = useCallback((item: CommandItem) => {
    if (item.path) navigate(item.path);
    if (item.action) item.action();
    setOpen(false);
    setQuery('');
  }, [navigate]);

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, allItems.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && allItems[selectedIndex]) {
        e.preventDefault();
        execute(allItems[selectedIndex]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, selectedIndex, allItems, execute]);

  useEffect(() => { setSelectedIndex(0); }, [query]);

  let globalIndex = -1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[560px] p-0 gap-0 glass border-border/50 overflow-hidden rounded-2xl">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 border-b border-border/30">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar páginas, ações..."
            className="flex-1 h-14 bg-transparent border-none outline-none text-base font-body placeholder:text-muted-foreground/50"
          />
          <kbd className="hidden sm:inline-flex h-6 items-center rounded border border-border/50 bg-muted px-2 text-[11px] font-mono text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto p-2 no-scrollbar">
          <AnimatePresence mode="wait">
            {allItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="p-3 rounded-2xl bg-muted/50 mb-3">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-body">Nenhum resultado para "{query}"</p>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
                {grouped.navigation.length > 0 && (
                  <>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 font-body">Navegação</p>
                    {grouped.navigation.map(item => {
                      globalIndex++;
                      const idx = globalIndex;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => execute(item)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group',
                            selectedIndex === idx
                              ? 'bg-accent/80 shadow-sm'
                              : 'hover:bg-accent/40'
                          )}
                        >
                          <div className={cn('p-2 rounded-lg bg-gradient-to-br transition-transform group-hover:scale-110', item.gradient)}>
                            <Icon className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium font-body">{item.label}</p>
                            {item.description && <p className="text-xs text-muted-foreground font-body truncate">{item.description}</p>}
                          </div>
                          <ArrowRight className={cn('h-4 w-4 text-muted-foreground transition-all', selectedIndex === idx ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1')} />
                        </button>
                      );
                    })}
                  </>
                )}

                {grouped.action.length > 0 && (
                  <>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 font-body mt-1">Ações Rápidas</p>
                    {grouped.action.map(item => {
                      globalIndex++;
                      const idx = globalIndex;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => execute(item)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group',
                            selectedIndex === idx
                              ? 'bg-accent/80 shadow-sm'
                              : 'hover:bg-accent/40'
                          )}
                        >
                          <div className={cn('p-2 rounded-lg bg-gradient-to-br transition-transform group-hover:scale-110', item.gradient)}>
                            <Icon className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium font-body">{item.label}</p>
                            {item.description && <p className="text-xs text-muted-foreground font-body truncate">{item.description}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            {item.shortcut && (
                              <kbd className="h-5 min-w-[20px] inline-flex items-center justify-center rounded border border-border/50 bg-muted px-1.5 text-[10px] font-mono text-muted-foreground">
                                {item.shortcut}
                              </kbd>
                            )}
                            <ArrowRight className={cn('h-4 w-4 text-muted-foreground transition-all', selectedIndex === idx ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1')} />
                          </div>
                        </button>
                      );
                    })}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/30 bg-muted/30">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-body">
            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded border border-border/50 bg-muted text-[10px]">↑↓</kbd> navegar</span>
            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded border border-border/50 bg-muted text-[10px]">↵</kbd> selecionar</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Zap className="h-3 w-3 text-primary" />
            <span className="font-body">Command Palette</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
