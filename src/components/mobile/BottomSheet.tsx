import React from 'react';
import { cn } from '@/lib/utils';
interface BottomSheetProps { children?: React.ReactNode; className?: string; }
export const BottomSheet: React.FC<BottomSheetProps> = ({ children, className }) => (
  <div className={cn('md:hidden', className)}>{children || 'BottomSheet'}</div>
);
export default BottomSheet;
