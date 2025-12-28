import React from 'react';
import { cn } from '@/lib/utils';

interface DueDateProps { className?: string; children?: React.ReactNode; }

/**
 * Seletor de prazo
 */
export const DueDate: React.FC<DueDateProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default DueDate;
