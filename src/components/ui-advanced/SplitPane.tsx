import React from 'react';
import { cn } from '@/lib/utils';

interface SplitPaneProps { className?: string; children?: React.ReactNode; }

/**
 * Divisor de painéis
 */
export const SplitPane: React.FC<SplitPaneProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default SplitPane;
