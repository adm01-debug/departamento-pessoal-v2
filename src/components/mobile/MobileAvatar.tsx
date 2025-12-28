import React from 'react';
import { cn } from '@/lib/utils';

interface MobileAvatarProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Avatar com gestos
 * Otimizado para dispositivos móveis
 */
export const MobileAvatar: React.FC<MobileAvatarProps> = ({ className, children }) => {
  return (
    <div className={cn('mobile-component', className)}>
      {children}
    </div>
  );
};

export default MobileAvatar;
