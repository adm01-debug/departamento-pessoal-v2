/**
 * @fileoverview Campo de busca para filtros
 * @module components/filter/FilterSearch
 */
import { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface FilterSearchProps { value: string; onChange: (v: string) => void; placeholder?: string; }

export const FilterSearch = memo(function FilterSearch({ value, onChange, placeholder = 'Buscar...' }: FilterSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="pl-10" />
    </div>
  );
});
