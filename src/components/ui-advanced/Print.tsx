import React from 'react';
import { cn } from '@/lib/utils';

interface PrintProps { className?: string; children?: React.ReactNode; }

/**
 * Botão de imprimir
 */
export const Print: React.FC<PrintProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Print;
