import { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AuditoriaFiltrosProps {
  onFilterChange?: (filters: Record<string, string>) => void;
  className?: string;
}

export const AuditoriaFiltros = memo(function AuditoriaFiltros({ onFilterChange, className }: AuditoriaFiltrosProps) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      <Input 
        placeholder="Buscar..." 
        className="max-w-xs"
        onChange={(e) => onFilterChange?.({ search: e.target.value })}
      />
      <Select onValueChange={(value) => onFilterChange?.({ tipo: value })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="criar">Criar</SelectItem>
          <SelectItem value="editar">Editar</SelectItem>
          <SelectItem value="excluir">Excluir</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
});

export default AuditoriaFiltros;
