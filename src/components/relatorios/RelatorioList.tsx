/**
 * @fileoverview Lista de relatórios
 * @module components/relatorios/RelatorioList
 */
import { memo } from 'react';
import { RelatorioCard } from './RelatorioCard';
import { FileText } from 'lucide-react';

interface Relatorio { id: string; titulo: string; descricao: string; categoria: string; ultimaGeracao?: string; }
interface RelatorioListProps { relatorios: Relatorio[]; onGerar: (id: string) => void; onVisualizar?: (id: string) => void; }

export const RelatorioList = memo(function RelatorioList({ relatorios, onGerar, onVisualizar }: RelatorioListProps) {
  if (relatorios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <FileText className="h-12 w-12 mb-4 opacity-50" />
        <p>Nenhum relatório encontrado</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {relatorios.map(rel => <RelatorioCard key={rel.id} {...rel} onGerar={onGerar} onVisualizar={onVisualizar} />)}
    </div>
  );
});
