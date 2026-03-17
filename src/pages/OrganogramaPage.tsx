import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresa } from '@/contexts';
import { Network, Users, Briefcase, Search, ChevronDown, ChevronRight, Mail, Phone, LayoutGrid, GitBranch } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const gradients = [
  'from-primary to-primary-glow',
  'from-info to-info/70',
  'from-success to-success/70',
  'from-warning to-warning/70',
  'from-destructive to-destructive/70',
  'from-primary-glow to-primary',
];

function getInitials(name: string) {
  return name?.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';
}

function ColaboradorCard({ col, compact }: { col: any; compact?: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-2 rounded-xl transition-colors",
      compact ? "py-1" : "p-2 bg-background/50 hover:bg-accent/30"
    )}>
      <Avatar className="h-7 w-7 border border-border/40">
        <AvatarFallback className="text-[10px] font-display bg-primary/10 text-primary">{getInitials(col.nome_completo)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-body font-medium truncate">{col.nome_completo}</p>
        <p className="text-[10px] text-muted-foreground font-body truncate">{col.cargo || 'Sem cargo'}</p>
      </div>
      {!compact && col.email && (
        <a href={`mailto:${col.email}`} className="text-muted-foreground hover:text-primary">
          <Mail className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}

function DepartamentoNode({ dept, index, expanded, onToggle, viewMode }: {
  dept: any; index: number; expanded: boolean; onToggle: () => void; viewMode: string;
}) {
  const gradientIdx = index % gradients.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={cn(viewMode === 'tree' && 'ml-8 relative')}
    >
      {viewMode === 'tree' && (
        <div className="absolute -left-6 top-0 bottom-0 w-px bg-border/40" />
      )}
      <Card className="border border-border/30 rounded-2xl hover:shadow-elevated transition-all overflow-hidden">
        <div className={cn('h-[2px] bg-gradient-to-r', gradients[gradientIdx])} />
        <CardContent className="p-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onToggle}>
            <div className={cn('p-2 rounded-xl bg-gradient-to-br shrink-0', gradients[gradientIdx])}>
              <Users className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-sm">{dept.nome}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-body">{dept.colaboradores?.length || 0} pessoas</Badge>
                {dept.responsavel && <Badge className="text-[10px] font-body bg-primary/10 text-primary border-0">{dept.responsavel}</Badge>}
              </div>
            </div>
            {dept.colaboradores?.length > 0 && (
              expanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>

          <AnimatePresence>
            {expanded && dept.colaboradores?.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-1 border-t border-border/20 pt-3">
                  {dept.colaboradores.map((c: any, ci: number) => (
                    <ColaboradorCard key={ci} col={c} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function OrganogramaPage() {
  const { empresaAtual } = useEmpresa();
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState<string>('todos');
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('grid');

  const { data: departamentos, isLoading } = useQuery({
    queryKey: ['organograma_enhanced', empresaAtual?.id],
    enabled: !!empresaAtual?.id,
    queryFn: async () => {
      const { data: deps, error } = await supabase.from('departamentos')
        .select('*').eq('empresa_id', empresaAtual!.id).order('nome');
      if (error) throw error;

      const { data: cols, error: colError } = await supabase.from('colaboradores')
        .select('nome_completo, cargo, departamento, email, telefone')
        .eq('empresa_id', empresaAtual!.id).eq('status', 'ativo').order('nome_completo');
      if (colError) throw colError;

      return (deps || []).map((d: any) => ({
        ...d,
        colaboradores: (cols || []).filter((c: any) => c.departamento === d.nome),
      }));
    },
  });

  const toggleDept = (id: string) => {
    setExpandedDepts(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    if (departamentos) setExpandedDepts(new Set(departamentos.map((d: any) => d.id)));
  };
  const collapseAll = () => setExpandedDepts(new Set());

  const filtered = useMemo(() => {
    if (!departamentos) return [];
    return departamentos
      .filter((d: any) => filterDept === 'todos' || d.id === filterDept)
      .map((d: any) => ({
        ...d,
        colaboradores: search
          ? d.colaboradores.filter((c: any) =>
              c.nome_completo?.toLowerCase().includes(search.toLowerCase()) ||
              c.cargo?.toLowerCase().includes(search.toLowerCase())
            )
          : d.colaboradores,
      }))
      .filter((d: any) => !search || d.colaboradores.length > 0);
  }, [departamentos, filterDept, search]);

  const totalColaboradores = departamentos?.reduce((acc: number, d: any) => acc + (d.colaboradores?.length || 0), 0) || 0;

  return (
    <PageLayout
      title="Organograma"
      description="Estrutura organizacional interativa"
      icon={<Network className="h-5 w-5 text-primary-foreground" />}
      gradient="from-primary/80 to-primary"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="border-border/30 rounded-2xl"><CardContent className="p-3 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary-glow"><Briefcase className="h-4 w-4 text-primary-foreground" /></div>
          <div><p className="text-lg font-bold font-display">{departamentos?.length || 0}</p><p className="text-[10px] text-muted-foreground font-body">Departamentos</p></div>
        </CardContent></Card>
        <Card className="border-border/30 rounded-2xl"><CardContent className="p-3 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-info to-info/70"><Users className="h-4 w-4 text-primary-foreground" /></div>
          <div><p className="text-lg font-bold font-display">{totalColaboradores}</p><p className="text-[10px] text-muted-foreground font-body">Colaboradores</p></div>
        </CardContent></Card>
        <Card className="border-border/30 rounded-2xl"><CardContent className="p-3 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-success to-success/70"><Users className="h-4 w-4 text-primary-foreground" /></div>
          <div><p className="text-lg font-bold font-display">{departamentos?.length ? Math.round(totalColaboradores / departamentos.length) : 0}</p><p className="text-[10px] text-muted-foreground font-body">Média/Dept</p></div>
        </CardContent></Card>
        <Card className="border-border/30 rounded-2xl"><CardContent className="p-3 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-warning to-warning/70"><Briefcase className="h-4 w-4 text-primary-foreground" /></div>
          <div><p className="text-lg font-bold font-display">{departamentos?.reduce((max: number, d: any) => Math.max(max, d.colaboradores?.length || 0), 0) || 0}</p><p className="text-[10px] text-muted-foreground font-body">Maior Dept</p></div>
        </CardContent></Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar colaborador ou cargo..."
            className="pl-9 rounded-xl"
          />
        </div>
        <Select value={filterDept} onValueChange={setFilterDept}>
          <SelectTrigger className="w-[200px] rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os departamentos</SelectItem>
            {departamentos?.map((d: any) => <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex gap-1 bg-muted/30 rounded-xl p-1">
          <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8 rounded-lg" onClick={() => setViewMode('grid')}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === 'tree' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8 rounded-lg" onClick={() => setViewMode('tree')}>
            <GitBranch className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={expandAll} className="rounded-xl font-body text-xs">Expandir Tudo</Button>
        <Button variant="outline" size="sm" onClick={collapseAll} className="rounded-xl font-body text-xs">Recolher</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : !filtered?.length ? (
        <div className="text-center py-12">
          <Network className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-body">{search ? 'Nenhum resultado encontrado' : 'Cadastre departamentos para visualizar o organograma'}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Company header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
            <Card className="border border-primary/30 rounded-2xl shadow-glow inline-block">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-glow">
                  <Briefcase className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-display font-bold">{empresaAtual?.razao_social || 'Empresa'}</p>
                  <p className="text-muted-foreground font-body text-xs">{departamentos?.length || 0} departamentos · {totalColaboradores} colaboradores</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Connector line */}
          {viewMode === 'tree' && <div className="w-px h-6 bg-border/40 mx-auto" />}

          {/* Departments */}
          <div className={cn(
            viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-3'
          )}>
            {filtered.map((dept: any, i: number) => (
              <DepartamentoNode
                key={dept.id}
                dept={dept}
                index={i}
                expanded={expandedDepts.has(dept.id)}
                onToggle={() => toggleDept(dept.id)}
                viewMode={viewMode}
              />
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
