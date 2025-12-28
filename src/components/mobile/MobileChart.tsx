import React from 'react';
import { cn } from '@/lib/utils';

interface MobileChartProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Gráficos responsivos mobile
 * Otimizado para dispositivos móveis
 */
export const MobileChart: React.FC<MobileChartProps> = ({ className, children }) => {
  return (
    <div className={cn('mobile-component', className)}>
      {children}
    </div>
  );
};

export default MobileChart;
