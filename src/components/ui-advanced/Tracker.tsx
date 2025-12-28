import React from 'react';
import { cn } from '@/lib/utils';

interface TrackerProps { className?: string; children?: React.ReactNode; }

/**
 * Rastreador de tempo
 */
export const Tracker: React.FC<TrackerProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Tracker;
