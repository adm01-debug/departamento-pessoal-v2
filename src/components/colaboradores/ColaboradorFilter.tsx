/**
 * @fileoverview Filtro de colaboradores com busca e seleção
 * @module components/colaboradores/ColaboradorFilter
 */
import { memo, useState, useCallback } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterOption {
  value: string;
  label: string;
}

interface ColaboradorFilterProps {
  onSearchChange?: (value: string) => void;
  onStatusChange?: (status: string[]) => void;
  onDepartamentoChange?: (departamento: string) => void;
  departamentos?: FilterOption[];
  statusOptions?: FilterOption[];
  initialSearch?: string;
  initialStatus?: string[];
  initialDepartamento?: string;
}

const defaultStatusOptions: FilterOption[] = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'inativo', label: 'Inativo' },
  { value: 'ferias', label: 'Férias' },
  { value: 'afastado', label: 'Afastado' },
];

/**
 * Componente de filtro para lista de colaboradores
 * @param props - Propriedades do filtro
 * @returns Elemento React com filtros de busca, status e departamento
 */
export const ColaboradorFilter = memo(function ColaboradorFilter({
  onSearchChange,
  onStatusChange,
  onDepartamentoChange,
  departamentos = [],
  statusOptions = defaultStatusOptions,
  initialSearch = '',
  initialStatus = [],
  initialDepartamento = '',
}: ColaboradorFilterProps) {
  const [search, setSearch] = useState(initialSearch);
  const [selectedStatus, setSelectedStatus] = useState<string[]>(initialStatus);
  const [departamento, setDepartamento] = useState(initialDepartamento);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    onSearchChange?.(value);
  }, [onSearchChange]);

  const handleStatusToggle = useCallback((status: string) => {
    const newStatus = selectedStatus.includes(status)
      ? selectedStatus.filter(s => s !== status)
      : [...selectedStatus, status];
    setSelectedStatus(newStatus);
    onStatusChange?.(newStatus);
  }, [selectedStatus, onStatusChange]);

  const handleDepartamentoChange = useCallback((value: string) => {
    setDepartamento(value);
    onDepartamentoChange?.(value);
  }, [onDepartamentoChange]);

  const clearFilters = useCallback(() => {
    setSearch('');
    setSelectedStatus([]);
    setDepartamento('');
    onSearchChange?.('');
    onStatusChange?.([]);
    onDepartamentoChange?.('');
  }, [onSearchChange, onStatusChange, onDepartamentoChange]);

  const hasActiveFilters = search || selectedStatus.length > 0 || departamento;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar colaborador..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Status
              {selectedStatus.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {selectedStatus.length}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Filtrar por status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statusOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedStatus.includes(option.value)}
                onCheckedChange={() => handleStatusToggle(option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {departamentos.length > 0 && (
          <Select value={departamento} onValueChange={handleDepartamentoChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {departamentos.map((dep) => (
                <SelectItem key={dep.value} value={dep.value}>
                  {dep.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
});
