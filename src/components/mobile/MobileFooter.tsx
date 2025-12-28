import React from 'react';
import { cn } from '@/lib/utils';
interface MobileFooterProps { children?: React.ReactNode; className?: string; }
export const MobileFooter: React.FC<MobileFooterProps> = ({ children, className }) => (
  <div className={cn('md:hidden', className)}>{children || 'MobileFooter'}</div>
);
export default MobileFooter;
