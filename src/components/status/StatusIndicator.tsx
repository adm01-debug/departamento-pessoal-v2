import { cn } from '@/lib/utils';
const statusColors = { success: 'bg-green-500', error: 'bg-red-500', warning: 'bg-yellow-500', info: 'bg-blue-500', pending: 'bg-gray-400' };
interface StatusIndicatorProps { status: keyof typeof statusColors; pulse?: boolean; size?: 'sm' | 'md' | 'lg'; }
const sizes = { sm: 'h-2 w-2', md: 'h-3 w-3', lg: 'h-4 w-4' };
export function StatusIndicator({ status, pulse = false, size = 'md' }: StatusIndicatorProps) {
  return (<span className={cn('inline-block rounded-full', statusColors[status], sizes[size], pulse && 'animate-pulse')} />);
}
