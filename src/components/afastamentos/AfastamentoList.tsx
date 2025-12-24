/**
 * @fileoverview Lista de afastamentos com filtros e paginação
 * @module components/afastamentos/AfastamentoList
 */
import { memo, useState, useMemo } from 'react';
import { Search, Filter, Plus, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AfastamentoCard } from './AfastamentoCard';

type TipoAfastamento = 'atestado' | 'licenca_medica' | 'licenca_maternidade' | 'licenca_paternidade' | 'acidente_trabalho' | 'outros';
type StatusAfastamento = 'ativo' | 'encerrado' | 'pendente';

interface Afastamento {
  id: string;
  colaboradorNome: string;
  tipo: TipoAfastamento;
  dataInicio: string;
  dataFim?: string;
  diasAfastado: number;
  motivo?: string;
  status: StatusAfastamento;
  cid?: string;
}

interface AfastamentoListProps {
  afastamentos: Afastamento[];
  onNovoAfastamento?: () => void;
  onVerDetalhes?: (id: string) => void;
  onEditar?: (id: string) => void;
  isLoading?: boolean;
}

/**
 * Lista de afastamentos com filtros
 * @param props - Propriedades
 * @returns Elemento React
 */
export const AfastamentoList = memo(function AfastamentoList({
  afastamentos,
  onNovoAfastamento,
  onVerDetalhes,
  onEditar,
  isLoading = false,
}: AfastamentoListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');

  const filteredAfastamentos = useMemo(() => {
    return afastamentos.filter(a => {
      const matchSearch = a.colaboradorNome.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'todos' || a.status === statusFilter;
      const matchTipo = tipoFilter === 'todos' || a.tipo === tipoFilter;
      return matchSearch && matchStatus && matchTipo;
    });
  }, [afastamentos, search, statusFilter, tipoFilter]);

  const stats = useMemo(() => ({
    total: afastamentos.length,
    ativos: afastamentos.filter(a => a.status === 'ativo').length,
    encerrados: afastamentos.filter(a => a.status === 'encerrado').length,
  }), [afastamentos]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar colaborador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos status</SelectItem>
            <SelectItem value="ativo">Em Andamento</SelectItem>
            <SelectItem value="encerrado">Encerrado</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
          </SelectContent>
        </Select>

        <Select value={tipoFilter} onValueChange={setTipoFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos tipos</SelectItem>
            <SelectItem value="atestado">Atestado</SelectItem>
            <SelectItem value="licenca_medica">Licença Médica</SelectItem>
            <SelectItem value="licenca_maternidade">Maternidade</SelectItem>
            <SelectItem value="acidente_trabalho">Acidente Trabalho</SelectItem>
          </SelectContent>
        </Select>

        {onNovoAfastamento && (
          <Button onClick={onNovoAfastamento} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Afastamento
          </Button>
        )}
      </div>

      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>Total: {stats.total}</span>
        <span>Ativos: {stats.ativos}</span>
        <span>Encerrados: {stats.encerrados}</span>
      </div>

      {filteredAfastamentos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-medium">Nenhum afastamento encontrado</h3>
          <p className="text-sm text-muted-foreground">Tente ajustar os filtros</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAfastamentos.map(afastamento => (
            <AfastamentoCard
              key={afastamento.id}
              {...afastamento}
              onVerDetalhes={onVerDetalhes}
              onEditar={onEditar}
            />
          ))}
        </div>
      )}
    </div>
  );
});
