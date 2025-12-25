import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
interface Props { children: ReactNode; maxWidth?: 'sm'|'md'|'lg'|'xl'|'2xl'|'full'; className?: string; }
const widthMap = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl', '2xl': 'max-w-2xl', full: 'max-w-full' };
export const Container = memo(function Container({ children, maxWidth = 'xl', className }: Props) {
  return <div className={cn('mx-auto px-4', widthMap[maxWidth], className)}>{children}</div>;
});
