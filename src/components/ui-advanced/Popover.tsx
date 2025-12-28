import React from 'react';
import { cn } from '@/lib/utils';

interface PopoverProps { className?: string; children?: React.ReactNode; }

/**
 * Popover avançado
 */
export const Popover: React.FC<PopoverProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Popover;
