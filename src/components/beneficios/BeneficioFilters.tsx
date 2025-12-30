import { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BeneficioFiltersProps {
  onFilterChange?: (filters: Record<string, string>) => void;
  className?: string;
}

export const BeneficioFilters = memo(function BeneficioFilters({ onFilterChange, className }: BeneficioFiltersProps) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      <Input 
        placeholder="Buscar benefício..." 
        className="max-w-xs"
        onChange={(e) => onFilterChange?.({ search: e.target.value })}
      />
      <Select onValueChange={(value) => onFilterChange?.({ tipo: value })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="saude">Saúde</SelectItem>
          <SelectItem value="alimentacao">Alimentação</SelectItem>
          <SelectItem value="transporte">Transporte</SelectItem>
          <SelectItem value="outros">Outros</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
});

export default BeneficioFilters;
