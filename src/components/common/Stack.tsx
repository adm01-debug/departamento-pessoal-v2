import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
interface Props { children: ReactNode; size?: 'sm'|'md'|'lg'; className?: string; }
const sizeMap = { sm: 'space-y-2', md: 'space-y-4', lg: 'space-y-6' };
export const Stack = memo(function Stack({ children, size = 'md', className }: Props) {
  return <div className={cn('flex flex-col', sizeMap[size], className)}>{children}</div>;
});
