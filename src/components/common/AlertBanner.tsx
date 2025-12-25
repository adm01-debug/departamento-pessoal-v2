import { memo } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';
type Variant = 'info' | 'success' | 'warning' | 'error';
const icons = { info: Info, success: CheckCircle, warning: AlertCircle, error: XCircle };
const styles = { info: 'bg-blue-50 text-blue-800 border-blue-200', success: 'bg-green-50 text-green-800 border-green-200', warning: 'bg-yellow-50 text-yellow-800 border-yellow-200', error: 'bg-red-50 text-red-800 border-red-200' };
interface Props { variant?: Variant; title?: string; message: string; onClose?: () => void; className?: string; }
export const AlertBanner = memo(function AlertBanner({ variant = 'info', title, message, onClose, className }: Props) {
  const Icon = icons[variant];
  return (
    <div className={cn('flex items-start gap-3 p-4 border rounded-lg', styles[variant], className)}>
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1"><p className="font-medium">{title}</p><p className="text-sm">{message}</p></div>
      {onClose && <button onClick={onClose} className="hover:opacity-70"><X className="h-4 w-4" /></button>}
    </div>
  );
});
