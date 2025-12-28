import React from 'react';
import { cn } from '@/lib/utils';

interface AssigneeProps { className?: string; children?: React.ReactNode; }

/**
 * Seletor de responsável
 */
export const Assignee: React.FC<AssigneeProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Assignee;
