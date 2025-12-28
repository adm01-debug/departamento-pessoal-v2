import React from 'react';
import { cn } from '@/lib/utils';

interface MobileToastProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Notificações mobile
 * Otimizado para dispositivos móveis
 */
export const MobileToast: React.FC<MobileToastProps> = ({ className, children }) => {
  return (
    <div className={cn('mobile-component', className)}>
      {children}
    </div>
  );
};

export default MobileToast;
