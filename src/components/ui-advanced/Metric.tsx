import React from 'react';
import { cn } from '@/lib/utils';

interface MetricProps { className?: string; children?: React.ReactNode; }

/**
 * Métrica com variação
 */
export const Metric: React.FC<MetricProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Metric;
