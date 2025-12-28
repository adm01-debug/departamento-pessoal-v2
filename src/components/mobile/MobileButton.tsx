import React from 'react';
import { cn } from '@/lib/utils';

interface MobileButtonProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Botão com feedback tátil
 * Otimizado para dispositivos móveis
 */
export const MobileButton: React.FC<MobileButtonProps> = ({ className, children }) => {
  return (
    <div className={cn('mobile-component', className)}>
      {children}
    </div>
  );
};

export default MobileButton;
