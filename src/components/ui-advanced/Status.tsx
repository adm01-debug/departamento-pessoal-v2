import React from 'react';
import { cn } from '@/lib/utils';

interface StatusProps { className?: string; children?: React.ReactNode; }

/**
 * Seletor de status
 */
export const Status: React.FC<StatusProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Status;
