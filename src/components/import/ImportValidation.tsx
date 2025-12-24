import { memo } from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
interface ImportValidationProps { errors: string[]; warnings: string[]; success: number; }
export const ImportValidation = memo(function ImportValidation({ errors, warnings, success }: ImportValidationProps) {
  return (
    <div className="space-y-3">
      {success > 0 && <div className="flex items-center gap-2 text-green-600"><CheckCircle className="h-4 w-4" /><span>{success} registros válidos</span></div>}
      {warnings.map((w,i) => <div key={i} className="flex items-start gap-2 text-yellow-600"><AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" /><span className="text-sm">{w}</span></div>)}
      {errors.map((e,i) => <div key={i} className="flex items-start gap-2 text-red-600"><XCircle className="h-4 w-4 shrink-0 mt-0.5" /><span className="text-sm">{e}</span></div>)}
    </div>
  );
});
