import React from 'react';
import { cn } from '@/lib/utils';

interface LabelProps { className?: string; children?: React.ReactNode; }

/**
 * Label editável
 */
export const Label: React.FC<LabelProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Label;
