import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps { className?: string; children?: React.ReactNode; }

/**
 * Skeleton loader
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Skeleton;
