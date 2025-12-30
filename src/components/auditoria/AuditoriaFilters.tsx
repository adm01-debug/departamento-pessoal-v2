import { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AuditoriaFiltersProps {
  onFilterChange?: (filters: Record<string, string>) => void;
  className?: string;
}

export const AuditoriaFilters = memo(function AuditoriaFilters({ onFilterChange, className }: AuditoriaFiltersProps) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      <Input 
        placeholder="Buscar..." 
        className="max-w-xs"
        onChange={(e) => onFilterChange?.({ search: e.target.value })}
      />
      <Select onValueChange={(value) => onFilterChange?.({ action: value })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Ação" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="create">Criar</SelectItem>
          <SelectItem value="update">Atualizar</SelectItem>
          <SelectItem value="delete">Excluir</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
});

export default AuditoriaFilters;
