import React from 'react';
import { cn } from '@/lib/utils';

interface VisuallyHiddenProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function VisuallyHidden({ children, className, as: Component = 'span' }: VisuallyHiddenProps) {
  return <Component className={cn('sr-only', className)}>{children}</Component>;
}
