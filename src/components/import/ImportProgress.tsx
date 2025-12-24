/**
 * @fileoverview Progresso de importação
 * @module components/import/ImportProgress
 */
import { memo } from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Loader2 } from 'lucide-react';

interface ImportProgressProps { progress: number; status: 'importing' | 'complete' | 'error'; message?: string; }

export const ImportProgress = memo(function ImportProgress({ progress, status, message }: ImportProgressProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {status === 'importing' && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
        {status === 'complete' && <CheckCircle className="h-5 w-5 text-green-500" />}
        <span className="font-medium">{status === 'importing' ? 'Importando...' : status === 'complete' ? 'Concluído!' : 'Erro'}</span>
      </div>
      <Progress value={progress} />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
});
