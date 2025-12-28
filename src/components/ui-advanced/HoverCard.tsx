import React from 'react';
import { cn } from '@/lib/utils';

interface HoverCardProps { className?: string; children?: React.ReactNode; }

/**
 * Card de hover
 */
export const HoverCard: React.FC<HoverCardProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default HoverCard;
