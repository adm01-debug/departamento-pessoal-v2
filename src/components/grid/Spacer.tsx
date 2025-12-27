import { cn } from '@/lib/utils';
interface SpacerProps { size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string; }
const sizeMap = { sm: 'h-2', md: 'h-4', lg: 'h-8', xl: 'h-12' };
export function Spacer({ size = 'md', className }: SpacerProps) {
  return <div className={cn(sizeMap[size], className)} aria-hidden="true" />;
}
