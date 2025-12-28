import React from 'react';
import { cn } from '@/lib/utils';

interface MobileCardProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Card adaptado para touch
 * Otimizado para dispositivos móveis
 */
export const MobileCard: React.FC<MobileCardProps> = ({ className, children }) => {
  return (
    <div className={cn('mobile-component', className)}>
      {children}
    </div>
  );
};

export default MobileCard;
