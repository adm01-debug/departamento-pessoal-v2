import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingDotsProps { className?: string; children?: React.ReactNode; }

/**
 * Pontos de loading
 */
export const LoadingDots: React.FC<LoadingDotsProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default LoadingDots;
