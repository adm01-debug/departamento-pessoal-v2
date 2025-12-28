import React from 'react';
import { cn } from '@/lib/utils';

interface MobileDrawerProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Menu lateral deslizante
 * Otimizado para dispositivos móveis
 */
export const MobileDrawer: React.FC<MobileDrawerProps> = ({ className, children }) => {
  return (
    <div className={cn('mobile-component', className)}>
      {children}
    </div>
  );
};

export default MobileDrawer;
