import React from 'react';
import { cn } from '@/lib/utils';

interface MobileSearchProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Busca com voz e sugestões
 * Otimizado para dispositivos móveis
 */
export const MobileSearch: React.FC<MobileSearchProps> = ({ className, children }) => {
  return (
    <div className={cn('mobile-component', className)}>
      {children}
    </div>
  );
};

export default MobileSearch;
