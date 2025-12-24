/**
 * @fileoverview Lista de integrações
 * @module components/integracoes/IntegracaoList
 */
import { memo } from 'react';
import { IntegracaoCard } from './IntegracaoCard';
import { Plug } from 'lucide-react';

interface Integracao {
  id: string;
  nome: string;
  descricao: string;
  icone: React.ReactNode;
  status: 'ativo' | 'inativo' | 'erro';
  ultimaSync?: string;
}

interface IntegracaoListProps {
  integracoes: Integracao[];
  onToggle: (id: string, ativo: boolean) => void;
  onConfig: (id: string) => void;
  onSync: (id: string) => void;
}

export const IntegracaoList = memo(function IntegracaoList({
  integracoes, onToggle, onConfig, onSync
}: IntegracaoListProps) {
  if (integracoes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Plug className="h-12 w-12 mb-4 opacity-50" />
        <p>Nenhuma integração disponível</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {integracoes.map(integracao => (
        <IntegracaoCard key={integracao.id} {...integracao} onToggle={onToggle} onConfig={onConfig} onSync={onSync} />
      ))}
    </div>
  );
});
