import { memo, useState, useMemo } from 'react';
import { Search, Plus, Sun } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FeriasCard } from './FeriasCard';
import type { Ferias } from '@/types/ferias';

interface FeriasListProps {
  ferias: Ferias[];
  onNovaFerias?: () => void;
  isLoading?: boolean;
}

export const FeriasList = memo(function FeriasList({
  ferias,
  onNovaFerias,
  isLoading = false,
}: FeriasListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredFerias = useMemo(() => {
    return ferias.filter(f => {
      const matchStatus = statusFilter === 'todos' || f.status === statusFilter;
      return matchStatus;
    });
  }, [ferias, statusFilter]);

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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos status</SelectItem>
            <SelectItem value="vigente">Vigente</SelectItem>
            <SelectItem value="vencida">Vencida</SelectItem>
            <SelectItem value="quitada">Quitada</SelectItem>
          </SelectContent>
        </Select>

        {onNovaFerias && (
          <Button onClick={onNovaFerias} className="gap-2">
            <Plus className="h-4 w-4" />
            Agendar Férias
          </Button>
        )}
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
            <FeriasCard key={f.id} ferias={f} />
          ))}
        </div>
      )}
    </div>
  );
});
