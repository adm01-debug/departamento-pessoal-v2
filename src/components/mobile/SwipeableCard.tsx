import React from 'react';
import { cn } from '@/lib/utils';
interface SwipeableCardProps { children?: React.ReactNode; className?: string; }
export const SwipeableCard: React.FC<SwipeableCardProps> = ({ children, className }) => (
  <div className={cn('md:hidden', className)}>{children || 'SwipeableCard'}</div>
);
export default SwipeableCard;
