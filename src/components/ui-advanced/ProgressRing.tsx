import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps { className?: string; children?: React.ReactNode; }

/**
 * Anel de progresso
 */
export const ProgressRing: React.FC<ProgressRingProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default ProgressRing;
