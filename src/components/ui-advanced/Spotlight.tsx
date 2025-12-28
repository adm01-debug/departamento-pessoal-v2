import React from 'react';
import { cn } from '@/lib/utils';

interface SpotlightProps { className?: string; children?: React.ReactNode; }

/**
 * Destaque de elementos
 */
export const Spotlight: React.FC<SpotlightProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Spotlight;
