import React from 'react';
import { cn } from '@/lib/utils';

interface LockProps { className?: string; children?: React.ReactNode; }

/**
 * Botão de bloquear
 */
export const Lock: React.FC<LockProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Lock;
