import React from 'react';
import { cn } from '@/lib/utils';
interface PullToRefreshProps { children?: React.ReactNode; className?: string; }
export const PullToRefresh: React.FC<PullToRefreshProps> = ({ children, className }) => (
  <div className={cn('md:hidden', className)}>{children || 'PullToRefresh'}</div>
);
export default PullToRefresh;
