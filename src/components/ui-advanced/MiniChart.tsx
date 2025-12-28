import React from 'react';
import { cn } from '@/lib/utils';

interface MiniChartProps { className?: string; children?: React.ReactNode; }

/**
 * Mini gráfico
 */
export const MiniChart: React.FC<MiniChartProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default MiniChart;
