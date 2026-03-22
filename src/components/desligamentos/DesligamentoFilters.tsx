import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface FiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusChange: (v: string) => void;
  tipoFilter: string;
  onTipoChange: (v: string) => void;
}

const STATUS_OPTIONS = [
  { value: 'todos', label: 'Todos os Status' },
  { value: 'pendente', label: '⏳ Pendente' },
  { value: 'em_andamento', label: '🔄 Em Andamento' },
  { value: 'concluido', label: '✅ Concluído' },
  { value: 'finalizado', label: '📋 Finalizado' },
  { value: 'cancelado', label: '❌ Cancelado' },
];

const TIPO_OPTIONS = [
  { value: 'todos', label: 'Todos os Tipos' },
  { value: 'sem_justa_causa', label: 'Sem Justa Causa' },
  { value: 'com_justa_causa', label: 'Com Justa Causa' },
  { value: 'pedido_demissao', label: 'Pedido de Demissão' },
  { value: 'acordo_mutuo', label: 'Acordo Mútuo' },
  { value: 'termino_contrato', label: 'Término de Contrato' },
];

export function DesligamentoFilters({ search, onSearchChange, statusFilter, onStatusChange, tipoFilter, onTipoChange }: FiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por colaborador, motivo..."
          className="pl-9 rounded-xl"
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="rounded-xl w-full sm:w-[180px]">
          <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={tipoFilter} onValueChange={onTipoChange}>
        <SelectTrigger className="rounded-xl w-full sm:w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TIPO_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
