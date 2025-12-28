import React from 'react';
import { cn } from '@/lib/utils';
interface MobileFiltersProps { children?: React.ReactNode; className?: string; }
export const MobileFilters: React.FC<MobileFiltersProps> = ({ children, className }) => (
  <div className={cn('md:hidden', className)}>{children || 'MobileFilters'}</div>
);
export default MobileFilters;
