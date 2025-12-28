import React from 'react';
import { cn } from '@/lib/utils';

interface PriorityProps { className?: string; children?: React.ReactNode; }

/**
 * Seletor de prioridade
 */
export const Priority: React.FC<PriorityProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Priority;
