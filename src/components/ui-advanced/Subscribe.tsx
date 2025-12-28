import React from 'react';
import { cn } from '@/lib/utils';

interface SubscribeProps { className?: string; children?: React.ReactNode; }

/**
 * Botão de inscrever
 */
export const Subscribe: React.FC<SubscribeProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Subscribe;
