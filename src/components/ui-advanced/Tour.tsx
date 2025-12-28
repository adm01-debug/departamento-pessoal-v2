import React from 'react';
import { cn } from '@/lib/utils';

interface TourProps { className?: string; children?: React.ReactNode; }

/**
 * Tour guiado
 */
export const Tour: React.FC<TourProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Tour;
