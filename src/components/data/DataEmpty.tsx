/**
 * @fileoverview Estado vazio de dados
 * @module components/data/DataEmpty
 */
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Inbox, Plus } from 'lucide-react';

interface DataEmptyProps { titulo?: string; descricao?: string; icone?: React.ReactNode; acao?: { label: string; onClick: () => void }; }

export const DataEmpty = memo(function DataEmpty({ titulo = 'Nenhum dado encontrado', descricao, icone, acao }: DataEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="p-4 rounded-full bg-muted mb-4">{icone || <Inbox className="h-8 w-8 text-muted-foreground" />}</div>
      <h3 className="font-medium text-lg">{titulo}</h3>
      {descricao && <p className="text-sm text-muted-foreground mt-1 max-w-sm">{descricao}</p>}
      {acao && <Button onClick={acao.onClick} className="mt-4"><Plus className="h-4 w-4 mr-2" />{acao.label}</Button>}
    </div>
  );
});
