import React from 'react';
import { cn } from '@/lib/utils';

interface EstimateProps { className?: string; children?: React.ReactNode; }

/**
 * Estimativa de tempo
 */
export const Estimate: React.FC<EstimateProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Estimate;
