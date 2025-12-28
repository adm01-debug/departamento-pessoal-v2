import React from 'react';
import { cn } from '@/lib/utils';

interface CollapsibleProps { className?: string; children?: React.ReactNode; }

/**
 * Seção colapsável
 */
export const Collapsible: React.FC<CollapsibleProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Collapsible;
