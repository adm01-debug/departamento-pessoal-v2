import React from 'react';
import { cn } from '@/lib/utils';

interface UnlockProps { className?: string; children?: React.ReactNode; }

/**
 * Botão de desbloquear
 */
export const Unlock: React.FC<UnlockProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Unlock;
