import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
interface ErrorStateProps { title?: string; message?: string; onRetry?: () => void; className?: string; }
export function ErrorState({ title = 'Algo deu errado', message = 'Ocorreu um erro inesperado.', onRetry, className }: ErrorStateProps) {
  return (<div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}><AlertTriangle className="h-12 w-12 text-destructive mb-4" /><h3 className="font-semibold text-lg">{title}</h3><p className="text-muted-foreground mt-1">{message}</p>{onRetry && <Button onClick={onRetry} variant="outline" className="mt-4"><RefreshCw className="h-4 w-4 mr-2" />Tentar novamente</Button>}</div>);
}
