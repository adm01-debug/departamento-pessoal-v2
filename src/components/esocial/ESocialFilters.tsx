import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface ESocialFiltersProps {
  onSearchChange?: (search: string) => void;
  onStatusChange?: (status: string) => void;
}

export function ESocialFilters({ onSearchChange, onStatusChange }: ESocialFiltersProps) {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar eventos..." className="pl-9" onChange={(e) => onSearchChange?.(e.target.value)} />
      </div>
      <Select onValueChange={onStatusChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="pendente">Pendente</SelectItem>
          <SelectItem value="enviado">Enviado</SelectItem>
          <SelectItem value="processado">Processado</SelectItem>
          <SelectItem value="erro">Erro</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default ESocialFilters;
