import React from 'react';
import { cn } from '@/lib/utils';

interface SparklineProps { className?: string; children?: React.ReactNode; }

/**
 * Sparkline chart
 */
export const Sparkline: React.FC<SparklineProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Sparkline;
