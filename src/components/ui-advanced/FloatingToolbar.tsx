import React from 'react';
import { cn } from '@/lib/utils';

interface FloatingToolbarProps { className?: string; children?: React.ReactNode; }

/**
 * Toolbar flutuante
 */
export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default FloatingToolbar;
