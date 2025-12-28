import React from 'react';
import { cn } from '@/lib/utils';

interface MobileNavigationProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Navegação otimizada para mobile
 * Otimizado para dispositivos móveis
 */
export const MobileNavigation: React.FC<MobileNavigationProps> = ({ className, children }) => {
  return (
    <div className={cn('mobile-component', className)}>
      {children}
    </div>
  );
};

export default MobileNavigation;
