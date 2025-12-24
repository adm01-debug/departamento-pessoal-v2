/**
 * @fileoverview Filtro de documentos com busca e categorias
 * @module components/documentos/DocumentoFilter
 */
import { memo, useState, useCallback } from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DocumentoFilterProps {
  onSearchChange?: (value: string) => void;
  onTipoChange?: (tipo: string) => void;
  onStatusChange?: (status: string) => void;
  onDataChange?: (data: Date | undefined) => void;
  tipos?: { value: string; label: string }[];
}

const defaultTipos = [
  { value: 'contrato', label: 'Contrato' },
  { value: 'atestado', label: 'Atestado' },
  { value: 'declaracao', label: 'Declaração' },
  { value: 'comprovante', label: 'Comprovante' },
  { value: 'certidao', label: 'Certidão' },
];

/**
 * Filtro para lista de documentos
 * @param props - Propriedades do filtro
 * @returns Elemento React
 */
export const DocumentoFilter = memo(function DocumentoFilter({
  onSearchChange,
  onTipoChange,
  onStatusChange,
  onDataChange,
  tipos = defaultTipos,
}: DocumentoFilterProps) {
  const [search, setSearch] = useState('');
  const [tipo, setTipo] = useState('');
  const [status, setStatus] = useState('');
  const [data, setData] = useState<Date>();

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    onSearchChange?.(value);
  }, [onSearchChange]);

  const handleTipoChange = useCallback((value: string) => {
    setTipo(value);
    onTipoChange?.(value);
  }, [onTipoChange]);

  const handleStatusChange = useCallback((value: string) => {
    setStatus(value);
    onStatusChange?.(value);
  }, [onStatusChange]);

  const handleDataChange = useCallback((value: Date | undefined) => {
    setData(value);
    onDataChange?.(value);
  }, [onDataChange]);

  const clearFilters = useCallback(() => {
    setSearch('');
    setTipo('');
    setStatus('');
    setData(undefined);
    onSearchChange?.('');
    onTipoChange?.('');
    onStatusChange?.('');
    onDataChange?.(undefined);
  }, [onSearchChange, onTipoChange, onStatusChange, onDataChange]);

  const activeFilters = [search, tipo, status, data].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar documento..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={tipo} onValueChange={handleTipoChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {tipos.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="vencido">Vencido</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[140px] justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              {data ? format(data, 'dd/MM/yyyy') : 'Data'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={data}
              onSelect={handleDataChange}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>

        {activeFilters > 0 && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <X className="h-4 w-4" />
            <Badge variant="secondary" className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
              {activeFilters}
            </Badge>
          </Button>
        )}
      </div>
    </div>
  );
});
