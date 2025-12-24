/**
 * @fileoverview Lista de departamentos
 * @module components/departamento/DepartamentoList
 */
import { memo } from 'react';
import { DepartamentoCard } from './DepartamentoCard';
import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Departamento {
  id: string;
  nome: string;
  sigla?: string;
  gestor?: { nome: string; avatar?: string; };
  colaboradoresCount?: number;
  cargosCount?: number;
  ativo?: boolean;
}

interface DepartamentoListProps {
  departamentos: Departamento[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
  onAdd?: () => void;
}

/**
 * Lista de departamentos em grid
 */
export const DepartamentoList = memo(function DepartamentoList({
  departamentos, loading, onEdit, onDelete, onClick, onAdd
}: DepartamentoListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />)}
      </div>
    );
  }

  if (departamentos.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="font-medium mb-1">Nenhum departamento</h3>
        <p className="text-sm text-muted-foreground mb-4">Comece criando o primeiro</p>
        {onAdd && <Button onClick={onAdd}><Plus className="h-4 w-4 mr-2" />Novo Departamento</Button>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {departamentos.map(dep => (
        <DepartamentoCard key={dep.id} {...dep} onEdit={onEdit} onDelete={onDelete} onClick={onClick} />
      ))}
    </div>
  );
});
