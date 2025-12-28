import React from 'react';
import { cn } from '@/lib/utils';

interface MobileFormProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Formulário mobile-first
 * Otimizado para dispositivos móveis
 */
export const MobileForm: React.FC<MobileFormProps> = ({ className, children }) => {
  return (
    <div className={cn('mobile-component', className)}>
      {children}
    </div>
  );
};

export default MobileForm;
