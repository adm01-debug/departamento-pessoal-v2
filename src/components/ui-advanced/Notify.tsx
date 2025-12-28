import React from 'react';
import { cn } from '@/lib/utils';

interface NotifyProps { className?: string; children?: React.ReactNode; }

/**
 * Botão de notificar
 */
export const Notify: React.FC<NotifyProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Notify;
