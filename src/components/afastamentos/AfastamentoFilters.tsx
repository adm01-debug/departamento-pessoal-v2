import { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AfastamentoFiltersProps {
  onFilterChange?: (filters: Record<string, string>) => void;
  className?: string;
}

export const AfastamentoFilters = memo(function AfastamentoFilters({ 
  onFilterChange,
  className 
}: AfastamentoFiltersProps) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      <Input 
        placeholder="Buscar..." 
        className="max-w-xs"
        onChange={(e) => onFilterChange?.({ search: e.target.value })}
      />
      <Select onValueChange={(value) => onFilterChange?.({ status: value })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ativo">Ativo</SelectItem>
          <SelectItem value="encerrado">Encerrado</SelectItem>
          <SelectItem value="pendente">Pendente</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
});

export default AfastamentoFilters;
