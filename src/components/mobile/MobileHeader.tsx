import React from 'react';
import { cn } from '@/lib/utils';
interface MobileHeaderProps { children?: React.ReactNode; className?: string; }
export const MobileHeader: React.FC<MobileHeaderProps> = ({ children, className }) => (
  <div className={cn('md:hidden', className)}>{children || 'MobileHeader'}</div>
);
export default MobileHeader;
