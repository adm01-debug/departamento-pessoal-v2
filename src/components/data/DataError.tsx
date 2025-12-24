/**
 * @fileoverview Estado de erro de dados
 * @module components/data/DataError
 */
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface DataErrorProps { titulo?: string; mensagem?: string; onRetry?: () => void; }

export const DataError = memo(function DataError({ titulo = 'Erro ao carregar', mensagem = 'Ocorreu um erro ao carregar os dados.', onRetry }: DataErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="p-4 rounded-full bg-red-50 mb-4"><AlertTriangle className="h-8 w-8 text-red-500" /></div>
      <h3 className="font-medium text-lg text-red-600">{titulo}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">{mensagem}</p>
      {onRetry && <Button variant="outline" onClick={onRetry} className="mt-4"><RefreshCw className="h-4 w-4 mr-2" />Tentar novamente</Button>}
    </div>
  );
});
