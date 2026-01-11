// V15-503
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
interface ColaboradorFiltersProps { filters: any; onFilterChange: (key: string, value: any) => void; onClear: () => void; }
export function ColaboradorFilters({ filters, onFilterChange, onClear }: ColaboradorFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar por nome ou CPF..." className="pl-10" value={filters.search || ''} onChange={(e) => onFilterChange('search', e.target.value)} /></div>
      <Select value={filters.status || ''} onValueChange={(v) => onFilterChange('status', v)}><SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="ativo">Ativo</SelectItem><SelectItem value="inativo">Inativo</SelectItem><SelectItem value="ferias">Férias</SelectItem><SelectItem value="afastado">Afastado</SelectItem></SelectContent></Select>
      <Select value={filters.tipo_contrato || ''} onValueChange={(v) => onFilterChange('tipo_contrato', v)}><SelectTrigger className="w-[150px]"><SelectValue placeholder="Contrato" /></SelectTrigger><SelectContent><SelectItem value="clt">CLT</SelectItem><SelectItem value="pj">PJ</SelectItem><SelectItem value="estagio">Estágio</SelectItem></SelectContent></Select>
      {Object.keys(filters).some(k => filters[k]) && <Button variant="ghost" onClick={onClear}><X className="h-4 w-4 mr-1" />Limpar</Button>}
    </div>
  );
}
