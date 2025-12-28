import React from 'react';
import { cn } from '@/lib/utils';

interface RestoreProps { className?: string; children?: React.ReactNode; }

/**
 * Botão de restaurar
 */
export const Restore: React.FC<RestoreProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Restore;
