/**
 * @fileoverview Lista de férias com filtros e paginação
 * @module components/ferias/FeriasList
 */
import { memo, useState, useMemo } from 'react';
import { Search, Plus, Sun, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FeriasCard } from './FeriasCard';

type StatusFerias = 'agendada' | 'em_andamento' | 'concluida' | 'cancelada';

interface Ferias {
  id: string;
  colaboradorNome: string;
  dataInicio: string;
  dataFim: string;
  diasTotais: number;
  diasUsufruidos?: number;
  status: StatusFerias;
  periodoAquisitivo?: string;
  abonoPecuniario?: boolean;
}

interface FeriasListProps {
  ferias: Ferias[];
  onNovaFerias?: () => void;
  onVerDetalhes?: (id: string) => void;
  onGerarAviso?: (id: string) => void;
  isLoading?: boolean;
}

/**
 * Lista de férias com filtros
 * @param props - Propriedades
 * @returns Elemento React
 */
export const FeriasList = memo(function FeriasList({
  ferias,
  onNovaFerias,
  onVerDetalhes,
  onGerarAviso,
  isLoading = false,
}: FeriasListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredFerias = useMemo(() => {
    return ferias.filter(f => {
      const matchSearch = f.colaboradorNome.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'todos' || f.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [ferias, search, statusFilter]);

  const stats = useMemo(() => ({
    total: ferias.length,
    agendadas: ferias.filter(f => f.status === 'agendada').length,
    emAndamento: ferias.filter(f => f.status === 'em_andamento').length,
    concluidas: ferias.filter(f => f.status === 'concluida').length,
  }), [ferias]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar colaborador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos status</SelectItem>
            <SelectItem value="agendada">Agendadas</SelectItem>
            <SelectItem value="em_andamento">Em Andamento</SelectItem>
            <SelectItem value="concluida">Concluídas</SelectItem>
            <SelectItem value="cancelada">Canceladas</SelectItem>
          </SelectContent>
        </Select>

        {onNovaFerias && (
          <Button onClick={onNovaFerias} className="gap-2">
            <Plus className="h-4 w-4" />
            Agendar Férias
          </Button>
        )}
      </div>

      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>Total: {stats.total}</span>
        <span>Agendadas: {stats.agendadas}</span>
        <span>Em andamento: {stats.emAndamento}</span>
        <span>Concluídas: {stats.concluidas}</span>
      </div>

      {filteredFerias.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Sun className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-medium">Nenhuma férias encontrada</h3>
          <p className="text-sm text-muted-foreground">Tente ajustar os filtros</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFerias.map(f => (
            <FeriasCard
              key={f.id}
              {...f}
              onVerDetalhes={onVerDetalhes}
              onGerarAviso={onGerarAviso}
            />
          ))}
        </div>
      )}
    </div>
  );
});
