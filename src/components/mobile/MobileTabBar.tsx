import React from 'react';
import { cn } from '@/lib/utils';

interface MobileTabBarProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Barra de abas inferior mobile
 * Otimizado para dispositivos móveis
 */
export const MobileTabBar: React.FC<MobileTabBarProps> = ({ className, children }) => {
  return (
    <div className={cn('mobile-component', className)}>
      {children}
    </div>
  );
};

export default MobileTabBar;
