import React from 'react';
import { cn } from '@/lib/utils';

interface QuickActionsProps { className?: string; children?: React.ReactNode; }

/**
 * Ações rápidas
 */
export const QuickActions: React.FC<QuickActionsProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default QuickActions;
