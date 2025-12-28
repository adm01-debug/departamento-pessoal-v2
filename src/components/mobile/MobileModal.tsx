import React from 'react';
import { cn } from '@/lib/utils';

interface MobileModalProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Modal fullscreen mobile
 * Otimizado para dispositivos móveis
 */
export const MobileModal: React.FC<MobileModalProps> = ({ className, children }) => {
  return (
    <div className={cn('mobile-component', className)}>
      {children}
    </div>
  );
};

export default MobileModal;
