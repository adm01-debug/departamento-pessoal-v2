/**
 * @fileoverview Validação de importação
 * @module components/import/ImportValidation
 */
import { memo } from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ImportValidationProps { errors: { linha: number; campo: string; mensagem: string }[]; warnings?: { linha: number; campo: string; mensagem: string }[]; }

export const ImportValidation = memo(function ImportValidation({ errors, warnings = [] }: ImportValidationProps) {
  if (errors.length === 0 && warnings.length === 0) return <div className="flex items-center gap-2 text-green-600"><CheckCircle className="h-5 w-5" />Arquivo válido!</div>;
  return (
    <div className="space-y-3">
      {errors.length > 0 && (<div className="p-3 bg-red-50 rounded-lg"><p className="font-medium text-red-600 flex items-center gap-1"><XCircle className="h-4 w-4" />{errors.length} erro(s)</p><ul className="text-sm text-red-600 mt-2 space-y-1">{errors.slice(0,5).map((e,i) => <li key={i}>Linha {e.linha}: {e.campo} - {e.mensagem}</li>)}</ul></div>)}
      {warnings.length > 0 && (<div className="p-3 bg-yellow-50 rounded-lg"><p className="font-medium text-yellow-600 flex items-center gap-1"><AlertTriangle className="h-4 w-4" />{warnings.length} aviso(s)</p><ul className="text-sm text-yellow-600 mt-2 space-y-1">{warnings.slice(0,5).map((w,i) => <li key={i}>Linha {w.linha}: {w.campo} - {w.mensagem}</li>)}</ul></div>)}
    </div>
  );
});
