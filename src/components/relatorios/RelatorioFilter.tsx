/**
 * @fileoverview Filtro de relatórios
 * @module components/relatorios/RelatorioFilter
 */
import { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface RelatorioFilterProps {
  search: string;
  categoria: string;
  categorias: string[];
  onSearchChange: (value: string) => void;
  onCategoriaChange: (value: string) => void;
  onClear: () => void;
}

export const RelatorioFilter = memo(function RelatorioFilter({
  search, categoria, categorias, onSearchChange, onCategoriaChange, onClear
}: RelatorioFilterProps) {
  const hasFilters = search || categoria;

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar relatório..." value={search} onChange={e => onSearchChange(e.target.value)} className="pl-10" />
      </div>
      <Select value={categoria} onValueChange={onCategoriaChange}>
        <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Categoria" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas</SelectItem>
          {categorias.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
        </SelectContent>
      </Select>
      {hasFilters && <Button variant="ghost" size="icon" onClick={onClear}><X className="h-4 w-4" /></Button>}
    </div>
  );
});
