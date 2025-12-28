import React from 'react';
import { cn } from '@/lib/utils';

interface PlaceholderProps { className?: string; children?: React.ReactNode; }

/**
 * Placeholder animado
 */
export const Placeholder: React.FC<PlaceholderProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Placeholder;
