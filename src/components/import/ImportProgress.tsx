import { memo } from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Loader2 } from 'lucide-react';
interface ImportProgressProps { total: number; current: number; status: 'processing' | 'completed'; }
export const ImportProgress = memo(function ImportProgress({ total, current, status }: ImportProgressProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="flex items-center gap-2">{status === 'processing' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 text-green-500" />}{status === 'processing' ? 'Importando...' : 'Concluído'}</span>
        <span>{current} de {total}</span>
      </div>
      <Progress value={percent} />
    </div>
  );
});
