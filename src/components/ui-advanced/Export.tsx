import React from 'react';
import { cn } from '@/lib/utils';

interface ExportProps { className?: string; children?: React.ReactNode; }

/**
 * Botão de exportar
 */
export const Export: React.FC<ExportProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Export;
