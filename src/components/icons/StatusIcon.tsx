import { memo } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
interface StatusIconProps { status: 'success'|'error'|'pending'|'warning'|'loading'; className?: string; }
const cfg = { success: { icon: CheckCircle, color: 'text-green-500' }, error: { icon: XCircle, color: 'text-red-500' }, pending: { icon: Clock, color: 'text-yellow-500' }, warning: { icon: AlertTriangle, color: 'text-orange-500' }, loading: { icon: Loader2, color: 'text-blue-500 animate-spin' } };
export const StatusIcon = memo(function StatusIcon({ status, className }: StatusIconProps) {
  const { icon: Icon, color } = cfg[status];
  return <Icon className={cn('h-4 w-4', color, className)} />;
});
