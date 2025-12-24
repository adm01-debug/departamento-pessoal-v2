/**
 * @fileoverview Lista de feriados
 * @module components/feriados/FeriadoList
 */
import { memo } from 'react';
import { FeriadoCard } from './FeriadoCard';
import { Calendar } from 'lucide-react';

interface Feriado {
  id: string;
  nome: string;
  data: string;
  tipo: 'nacional' | 'estadual' | 'municipal' | 'facultativo';
  recorrente: boolean;
}

interface FeriadoListProps {
  feriados: Feriado[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

/**
 * Lista de feriados em grid
 */
export const FeriadoList = memo(function FeriadoList({
  feriados, onEdit, onDelete
}: FeriadoListProps) {
  if (feriados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Calendar className="h-12 w-12 mb-4 opacity-50" />
        <p>Nenhum feriado cadastrado</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {feriados.map(feriado => (
        <FeriadoCard
          key={feriado.id}
          {...feriado}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
});
