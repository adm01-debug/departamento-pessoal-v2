import { memo } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface Props { title?: string; message?: string; onRetry?: () => void; }
export const ErrorMessage = memo(function ErrorMessage({ title = 'Erro', message = 'Algo deu errado', onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="p-3 rounded-full bg-red-100 mb-4"><AlertCircle className="h-8 w-8 text-red-600" /></div>
      <h3 className="text-lg font-medium text-red-900">{title}</h3>
      <p className="text-sm text-red-600 mt-1">{message}</p>
      {onRetry && <Button variant="outline" size="sm" onClick={onRetry} className="mt-4"><RefreshCw className="h-4 w-4 mr-2" />Tentar novamente</Button>}
    </div>
  );
});
