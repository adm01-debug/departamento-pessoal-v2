import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface DocumentoFiltersProps {
  onSearchChange?: (search: string) => void;
  onTipoChange?: (tipo: string) => void;
}

export function DocumentoFilters({ onSearchChange, onTipoChange }: DocumentoFiltersProps) {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar documentos..."
          className="pl-9"
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
      <Select onValueChange={onTipoChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Tipo de documento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="contrato">Contrato</SelectItem>
          <SelectItem value="atestado">Atestado</SelectItem>
          <SelectItem value="documento_pessoal">Documento Pessoal</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
