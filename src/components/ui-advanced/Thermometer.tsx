import React from 'react';
import { cn } from '@/lib/utils';

interface ThermometerProps { className?: string; children?: React.ReactNode; }

/**
 * Termômetro visual
 */
export const Thermometer: React.FC<ThermometerProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Thermometer;
