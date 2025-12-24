/**
 * @fileoverview Lista de cargos
 * @module components/cargo/CargoList
 */
import { memo } from 'react';
import { CargoCard } from './CargoCard';
import { Briefcase, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Cargo {
  id: string;
  nome: string;
  departamento?: string;
  cbo?: string;
  salarioBase?: number;
  colaboradoresCount?: number;
  ativo?: boolean;
}

interface CargoListProps {
  cargos: Cargo[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
}

/**
 * Lista de cargos em grid
 */
export const CargoList = memo(function CargoList({
  cargos, loading, onEdit, onDelete, onAdd
}: CargoListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (cargos.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="font-medium mb-1">Nenhum cargo cadastrado</h3>
        <p className="text-sm text-muted-foreground mb-4">Comece adicionando o primeiro cargo</p>
        {onAdd && <Button onClick={onAdd}><Plus className="h-4 w-4 mr-2" />Novo Cargo</Button>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cargos.map(cargo => (
        <CargoCard key={cargo.id} {...cargo} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
});
