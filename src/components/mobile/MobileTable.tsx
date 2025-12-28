import React from 'react';
import { cn } from '@/lib/utils';

interface MobileTableProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Tabela com scroll horizontal
 * Otimizado para dispositivos móveis
 */
export const MobileTable: React.FC<MobileTableProps> = ({ className, children }) => {
  return (
    <div className={cn('mobile-component', className)}>
      {children}
    </div>
  );
};

export default MobileTable;
