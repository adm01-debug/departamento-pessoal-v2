import React from 'react';
import { cn } from '@/lib/utils';

interface GaugeProps { className?: string; children?: React.ReactNode; }

/**
 * Medidor gauge
 */
export const Gauge: React.FC<GaugeProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Gauge;
