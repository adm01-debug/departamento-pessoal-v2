/**
 * @fileoverview Lista de empresas
 * @module components/empresa/EmpresaList
 */
import { memo } from 'react';
import { EmpresaCard } from './EmpresaCard';
import { Building2 } from 'lucide-react';

interface Empresa { id: string; razaoSocial: string; nomeFantasia: string; cnpj: string; cidade: string; uf: string; colaboradores: number; matriz: boolean; }
interface EmpresaListProps { empresas: Empresa[]; onEdit: (id: string) => void; onSelect?: (id: string) => void; }

export const EmpresaList = memo(function EmpresaList({ empresas, onEdit, onSelect }: EmpresaListProps) {
  if (empresas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Building2 className="h-12 w-12 mb-4 opacity-50" />
        <p>Nenhuma empresa cadastrada</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {empresas.map(empresa => <EmpresaCard key={empresa.id} {...empresa} onEdit={onEdit} onSelect={onSelect} />)}
    </div>
  );
});
