import React from 'react';
import { cn } from '@/lib/utils';

interface MobileBadgeProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Badge adaptado
 * Otimizado para dispositivos móveis
 */
export const MobileBadge: React.FC<MobileBadgeProps> = ({ className, children }) => {
  return (
    <div className={cn('mobile-component', className)}>
      {children}
    </div>
  );
};

export default MobileBadge;
