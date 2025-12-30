import { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ColaboradorFiltersProps {
  onFilterChange?: (filters: Record<string, string>) => void;
  className?: string;
}

export const ColaboradorFilters = memo(function ColaboradorFilters({ onFilterChange, className }: ColaboradorFiltersProps) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      <Input 
        placeholder="Buscar colaborador..." 
        className="max-w-xs"
        onChange={(e) => onFilterChange?.({ search: e.target.value })}
      />
      <Select onValueChange={(value) => onFilterChange?.({ status: value })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ativo">Ativo</SelectItem>
          <SelectItem value="inativo">Inativo</SelectItem>
          <SelectItem value="afastado">Afastado</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => onFilterChange?.({ departamento: value })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Departamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ti">TI</SelectItem>
          <SelectItem value="rh">RH</SelectItem>
          <SelectItem value="financeiro">Financeiro</SelectItem>
          <SelectItem value="comercial">Comercial</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
});

export default ColaboradorFilters;
