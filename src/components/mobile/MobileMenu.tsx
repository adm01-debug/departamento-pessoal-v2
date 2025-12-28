import React from 'react';
import { cn } from '@/lib/utils';
interface MobileMenuProps { children?: React.ReactNode; className?: string; }
export const MobileMenu: React.FC<MobileMenuProps> = ({ children, className }) => (
  <div className={cn('md:hidden', className)}>{children || 'MobileMenu'}</div>
);
export default MobileMenu;
