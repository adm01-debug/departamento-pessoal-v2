import React from 'react';
import { cn } from '@/lib/utils';

interface ArchiveProps { className?: string; children?: React.ReactNode; }

/**
 * Botão de arquivar
 */
export const Archive: React.FC<ArchiveProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Archive;
