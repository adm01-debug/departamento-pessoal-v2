/**
 * @fileoverview Ícone customizado
 * @module components/icons/CustomIcon
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';

interface CustomIconProps { children: React.ReactNode; className?: string; size?: 'sm' | 'md' | 'lg'; }

const sizes = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };

export const CustomIcon = memo(function CustomIcon({ children, className, size = 'md' }: CustomIconProps) {
  return <span className={cn('inline-flex items-center justify-center', sizes[size], className)}>{children}</span>;
});
