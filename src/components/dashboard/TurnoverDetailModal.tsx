import { memo, useState, useEffect, useMemo } from 'react';
import { logger } from '@/lib/logger';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, UserMinus, Calendar, Building2, Briefcase, Loader2, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TurnoverDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mes: string; // formato: yyyy-MM
  mesLabel: string;
}

interface MovimentacaoColaborador {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  data: string;
  tipo: 'admissao' | 'desligamento';
}

export const TurnoverDetailModal = memo(function TurnoverDetailModal({ open, onOpenChange, mes, mesLabel }: TurnoverDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoColaborador[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'admissao' | 'desligamento'>('todos');
  const [filtroDepartamento, setFiltroDepartamento] = useState<string>('todos');

  useEffect(() => {
    if (open && mes) {
      fetchMovimentacoes();
      setFiltroTipo('todos');
      setFiltroDepartamento('todos');
    }
  }, [open, mes]);

  const fetchMovimentacoes = async () => {
    setLoading(true);
    try {
      const [year, month] = mes.split('-').map(Number);
      const monthDate = new Date(year, month - 1, 1);
      const monthStart = format(startOfMonth(monthDate), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(monthDate), 'yyyy-MM-dd');

      // Buscar admissões do mês
      const { data: admissoes, error: errAdm } = await supabase
        .from('colaboradores')
        .select('id, nome_completo, cargo, departamento, data_admissao')
        .gte('data_admissao', monthStart)
        .lte('data_admissao', monthEnd);

      if (errAdm) throw errAdm;

      // Buscar desligamentos do mês
      const { data: desligamentos, error: errDesl } = await supabase
        .from('colaboradores')
        .select('id, nome_completo, cargo, departamento, data_desligamento')
        .not('data_desligamento', 'is', null)
        .gte('data_desligamento', monthStart)
        .lte('data_desligamento', monthEnd);

      if (errDesl) throw errDesl;

      const movs: MovimentacaoColaborador[] = [
        ...(admissoes ?? []).map(a => ({
          id: a.id,
          nome: a.nome_completo,
          cargo: a.cargo,
          departamento: a.departamento,
          data: a.data_admissao,
          tipo: 'admissao' as const
        })),
        ...(desligamentos ?? []).map(d => ({
          id: d.id,
          nome: d.nome_completo,
          cargo: d.cargo,
          departamento: d.departamento,
          data: d.data_desligamento!,
          tipo: 'desligamento' as const
        }))
      ].sort((a, b) => a.data.localeCompare(b.data));

      setMovimentacoes(movs);
    } catch (error) {
      logger.error('Erro ao buscar movimentações:', error);
    } finally {
      setLoading(false);
    }
  };

  // Lista única de departamentos
  const departamentos = useMemo(() => {
    const deps = [...new Set(movimentacoes.map(m => m.departamento))].filter(Boolean).sort();
    return deps;
  }, [movimentacoes]);

  // Filtragem
  const movimentacoesFiltradas = useMemo(() => {
    return movimentacoes.filter(m => {
      const matchTipo = filtroTipo === 'todos' || m.tipo === filtroTipo;
      const matchDep = filtroDepartamento === 'todos' || m.departamento === filtroDepartamento;
      return matchTipo && matchDep;
    });
  }, [movimentacoes, filtroTipo, filtroDepartamento]);

  const admissoes = movimentacoesFiltradas.filter(m => m.tipo === 'admissao');
  const desligamentosFiltered = movimentacoesFiltradas.filter(m => m.tipo === 'desligamento');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Movimentações em {mesLabel}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filtroTipo} onValueChange={(v) => setFiltroTipo(v as typeof filtroTipo)}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas movimentações</SelectItem>
                  <SelectItem value="admissao">Apenas admissões</SelectItem>
                  <SelectItem value="desligamento">Apenas desligamentos</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filtroDepartamento} onValueChange={setFiltroDepartamento}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos departamentos</SelectItem>
                  {departamentos.map(dep => (
                    <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center gap-2 mb-2">
                  <UserPlus className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-success">Admissões</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{admissoes.length}</p>
              </div>
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-center gap-2 mb-2">
                  <UserMinus className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">Desligamentos</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{desligamentosFiltered.length}</p>
              </div>
            </div>

            {/* Lista de Movimentações */}
            <ScrollArea className="h-[300px] pr-4">
              {movimentacoesFiltradas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Calendar className="w-12 h-12 mb-4 opacity-50" />
                  <p>{filtroTipo !== 'todos' || filtroDepartamento !== 'todos' 
                    ? 'Nenhuma movimentação encontrada com os filtros aplicados' 
                    : 'Nenhuma movimentação neste mês'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {movimentacoesFiltradas.map((mov) => (
                    <div 
                      key={`${mov.id}-${mov.tipo}`}
                      className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted/80 transition-colors"
                    >
                      <div className={`p-2 rounded-full ${
                        mov.tipo === 'admissao' 
                          ? 'bg-success/20 text-success' 
                          : 'bg-destructive/20 text-destructive'
                      }`}>
                        {mov.tipo === 'admissao' ? (
                          <UserPlus className="w-4 h-4" />
                        ) : (
                          <UserMinus className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-foreground truncate">{mov.nome}</p>
                          <Badge 
                            variant={mov.tipo === 'admissao' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {mov.tipo === 'admissao' ? 'Admissão' : 'Desligamento'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {mov.cargo}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {mov.departamento}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(parseISO(mov.data), "dd 'de' MMMM", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
});
