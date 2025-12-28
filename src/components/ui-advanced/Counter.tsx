import React from 'react';
import { cn } from '@/lib/utils';

interface CounterProps { className?: string; children?: React.ReactNode; }

/**
 * Contador animado
 */
export const Counter: React.FC<CounterProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Counter;
