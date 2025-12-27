import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
interface ToastProps { type: 'success' | 'error' | 'warning' | 'info'; title: string; message?: string; className?: string; }
const icons = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info };
const styles = { success: 'bg-green-50 border-green-200 text-green-800', error: 'bg-red-50 border-red-200 text-red-800', warning: 'bg-yellow-50 border-yellow-200 text-yellow-800', info: 'bg-blue-50 border-blue-200 text-blue-800' };
export function CustomToast({ type, title, message, className }: ToastProps) {
  const Icon = icons[type];
  return (<div className={cn('flex items-start gap-3 p-4 rounded-lg border', styles[type], className)}><Icon className="w-5 h-5 mt-0.5" /><div><p className="font-medium">{title}</p>{message && <p className="text-sm opacity-80">{message}</p>}</div></div>);
}
