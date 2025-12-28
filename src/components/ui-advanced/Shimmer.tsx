import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerProps { className?: string; children?: React.ReactNode; }

/**
 * Efeito shimmer
 */
export const Shimmer: React.FC<ShimmerProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Shimmer;
