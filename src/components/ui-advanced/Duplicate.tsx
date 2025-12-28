import React from 'react';
import { cn } from '@/lib/utils';

interface DuplicateProps { className?: string; children?: React.ReactNode; }

/**
 * Botão de duplicar
 */
export const Duplicate: React.FC<DuplicateProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Duplicate;
