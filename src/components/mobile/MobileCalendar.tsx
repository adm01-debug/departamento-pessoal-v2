import React from 'react';
import { cn } from '@/lib/utils';

interface MobileCalendarProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Calendário touch-friendly
 * Otimizado para dispositivos móveis
 */
export const MobileCalendar: React.FC<MobileCalendarProps> = ({ className, children }) => {
  return (
    <div className={cn('mobile-component', className)}>
      {children}
    </div>
  );
};

export default MobileCalendar;
