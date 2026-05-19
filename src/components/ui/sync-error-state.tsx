import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SyncErrorStateProps {
  error: any;
  onRetry: () => void;
  entityName?: string;
}

export function SyncErrorState({ error, onRetry, entityName = "dados" }: SyncErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : 
                 typeof error === 'string' ? error : 
                 (error?.error || "Erro de conexão com o banco externo");

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-2xl mx-auto space-y-4">
      <Alert variant="destructive" className="border-destructive/30 bg-destructive/5 rounded-2xl shadow-sm">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="font-display font-bold">Erro de Sincronização</AlertTitle>
        <AlertDescription className="font-body text-sm mt-1">
          Não foi possível carregar os {entityName} do banco externo.
          <p className="mt-2 text-[11px] font-mono opacity-70 p-2 bg-background/50 rounded-lg">
            Detahes: {errorMessage}
          </p>
        </AlertDescription>
      </Alert>
      
      <Button 
        variant="outline" 
        onClick={onRetry} 
        className="rounded-xl gap-2 font-bold shadow-sm hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30"
      >
        <RefreshCw className="h-4 w-4" />
        Tentar Novamente
      </Button>
    </div>
  );
}
