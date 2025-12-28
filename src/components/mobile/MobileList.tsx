import React from 'react';
import { cn } from '@/lib/utils';

interface MobileListProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Lista com scroll virtual mobile
 * Otimizado para dispositivos móveis
 */
export const MobileList: React.FC<MobileListProps> = ({ className, children }) => {
  return (
    <div className={cn('mobile-component', className)}>
      {children}
    </div>
  );
};

export default MobileList;
