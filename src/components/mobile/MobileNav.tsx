import React from 'react';
import { cn } from '@/lib/utils';
interface MobileNavProps { children?: React.ReactNode; className?: string; }
export const MobileNav: React.FC<MobileNavProps> = ({ children, className }) => (
  <div className={cn('md:hidden', className)}>{children || 'MobileNav'}</div>
);
export default MobileNav;
