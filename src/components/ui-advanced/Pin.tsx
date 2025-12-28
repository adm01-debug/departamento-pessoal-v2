import React from 'react';
import { cn } from '@/lib/utils';

interface PinProps { className?: string; children?: React.ReactNode; }

/**
 * Botão de fixar
 */
export const Pin: React.FC<PinProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Pin;
